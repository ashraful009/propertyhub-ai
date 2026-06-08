export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface IBooking {
    id?: string;
    property_id: string;
    customer_id: string;
    vendor_id: string;
    booking_amount: number;
    status?: BookingStatus;
    created_at?: Date;
    updated_at?: Date;
}