import { Request, Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createInvoice, updatePaymentSuccess } from '../../repositories/customer/payment.repository';
import { ApiResponse } from '../../responses/ApiResponse';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { RESPONSE_MESSAGES } from '../../responses/responseMessages';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-05-27.dahlia',
});

export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { booking_id, milestone_id, amount, description } = req.body;

    if (!userId || !booking_id || !amount) {
      return ApiResponse.error(res, ERROR_MESSAGES.COMMON.MISSING_REQUIRED_FIELDS, 400);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Property Payment',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    await createInvoice(booking_id, userId, amount, session.id, milestone_id || null);
    ApiResponse.success(res, RESPONSE_MESSAGES.PAYMENT.CHECKOUT_CREATED, { checkout_url: session.url });
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return ApiResponse.error(res, ERROR_MESSAGES.PAYMENT.SESSION_ID_REQUIRED, 400);
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const success = await updatePaymentSuccess(session_id);

      if (success) {
        return ApiResponse.success(res, RESPONSE_MESSAGES.PAYMENT.VERIFIED);
      }
    }

    ApiResponse.error(res, ERROR_MESSAGES.PAYMENT.PAYMENT_NOT_SUCCESSFUL, 400);
  } catch (error) {
    ApiResponse.error(res, ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR, 500);
  }
};

export const generateReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { milestone_id } = req.params;
    // Dummy receipt implementation
    const receiptData = {
      milestone_id,
      receipt_url: `https://propertyhub-receipts.dummy.com/download/${milestone_id}.pdf`,
      generated_at: new Date()
    };
    ApiResponse.success(res, 'Receipt generated successfully', receiptData);
  } catch (error) {
    ApiResponse.error(res, 'Failed to generate receipt', 500);
  }
};