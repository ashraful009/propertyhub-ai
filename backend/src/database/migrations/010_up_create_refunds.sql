CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    total_paid NUMERIC(15, 2) NOT NULL,
    penalty_amount NUMERIC(15, 2) DEFAULT 0,
    refund_amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
