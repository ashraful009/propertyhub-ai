CREATE TABLE platform_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES installment_milestones(id) ON DELETE SET NULL,
    amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
