CREATE TYPE invoice_status AS ENUM ('PENDING', 'PAID', 'FAILED');

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES installment_milestones(id) ON DELETE SET NULL,
    stripe_session_id VARCHAR(255),
    amount NUMERIC(15, 2) NOT NULL,
    status invoice_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);
