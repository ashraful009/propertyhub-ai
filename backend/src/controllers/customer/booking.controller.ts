import { Request, Response } from "express";
import {AuthRequest} from "../../middlewares/auth.middleware"
import {insertBooking, findBookingByUser, updateBookingStatusInDb} from  '../../repositories/customer/booking.repository';


//  Create Booking (Customer)
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const customer_id = req.user?.id;
    const { property_id, vendor_id, booking_amount } = req.body;

    if (!customer_id || req.user?.role !== 'CUSTOMER') {
      res.status(403).json({ error: 'Only customers can book properties.' });
      return;
    }

    const bookingData = {
      property_id,
      customer_id,
      vendor_id,
      booking_amount
    };

    const newBooking = await insertBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//  Get Bookings (Customer/Vendor/Admin)
export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const bookings = await findBookingByUser(userId, role);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update Booking Status (Vendor/Admin)
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status: 'APPROVED', 'REJECTED' etc.

    const updatedBooking = await updateBookingStatusInDb(id as string, status);

    if (!updatedBooking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};