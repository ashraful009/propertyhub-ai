import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { processCustomerCancellation, processAutoCancellationForDefaults } from '../../repositories/customer/refund.repository';

// Customer cancell ownself
export const requestCancellation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { booking_id } = req.body;

    if (!userId || !booking_id) {
      res.status(400).json({ error: 'Missing booking_id.' });
      return;
    }

    const refundDetails = await processCustomerCancellation(booking_id, userId);

    res.status(200).json({
      success: true,
      message: 'Booking canceled successfully. 10% penalty applied.',
      data: refundDetails
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Cancellation failed.' });
  }
};

// admin use corn job to cancel
export const triggerAutoCancellation = async (req: Request, res: Response): Promise<void> => {
  try {
    const canceledCount = await processAutoCancellationForDefaults();
    res.status(200).json({
      success: true,
      message: `${canceledCount} defaulted bookings were automatically canceled. Properties marked as AVAILABLE.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};