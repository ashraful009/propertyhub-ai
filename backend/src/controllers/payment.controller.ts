import { Request, Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middlewares/auth.middleware';
import { createInvoice, updatePaymentSuccess } from '../repositories/payment.repository';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-05-27.dahlia', 
});

// Make Checkout Session 
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { booking_id, milestone_id, amount, description } = req.body;

    if (!userId || !booking_id || !amount) {
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }

    // Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'Property Payment',
            },
            unit_amount: Math.round(amount * 100), // Stripe cent calculate
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    // Save into database Pending Invoice 
    await createInvoice({
      user_id: userId,
      booking_id,
      milestone_id,
      stripe_session_id: session.id,
      amount,
    });

    res.status(200).json({
      success: true,
      checkout_url: session.url, 
    });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ২. Payment Success verify
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      res.status(400).json({ error: 'Session ID is required.' });
      return;
    }

    // check stripe session  
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const success = await updatePaymentSuccess(session_id);
      
      if (success) {
        res.status(200).json({ success: true, message: 'Payment verified and invoice updated.' });
        return;
      }
    }

    res.status(400).json({ error: 'Payment not successful or already verified.' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};