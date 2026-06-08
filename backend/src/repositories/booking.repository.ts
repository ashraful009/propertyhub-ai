import pool from '../config/db'
import {IBooking} from '../models/booking.model';


// new booking (customer)

export const insertBooking = async (bookingData: IBooking): Promise<IBooking> => {
    const query = `
    INSERT INTO bookings (property_id, customer_id, vendor_id, booking_amount) VALUES ($1, $2, $3, $4) RETURNING *`;

    const values = [
        bookingData.property_id,
        bookingData.customer_id,
        bookingData.vendor_id,
        bookingData.booking_amount
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


export const findBookingByUser = async (userId: string, role: string): Promise<any[]> => {
    let query = `
    SELECT b.*, p.title as property_title, p.location, u.name as customer_name
    FROM bookings b
    JOIN properties p ON b.property_id = p.id
    JOIN users u ON b.customer_id = u.id
    WHERE 
    `;

    if(role === 'CUSTOMER'){
        query += 'b.customer_id = $1'
    }else if(role === 'VENDOR'){
        query += 'b.vendor_id = $1'

    }else{
        query = `
        SELECT b.* p.title as property_title, p.location, u.name as customer_name
        FROM booking b
        JOIN properties p ON b.property_id = p.id
        JOIN users u ON b.customer_id = u.id`;
        const adminResult = await pool.query(query);
        return adminResult.rows;
    }
    query += `ORDER BY b.created_at DESC`;
    const result = await pool.query(query, [userId]);
    return result.rows;
    
}

// Booking Status update (Vendor & Admin)

export const updateBookingStatusInDb = async (bookingId: string, status: string): Promise<IBooking | null> =>{
    const query = `
    UPDATE bookings
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 
    RETURNING *`;

    const result = await pool.query(query, [status, bookingId]);
    return result.rows[0];
};