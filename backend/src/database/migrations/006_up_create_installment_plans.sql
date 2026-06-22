CREATE TABLE installment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    total_due_amount NUMERIC(15, 2) NOT NULL,
    number_of_installments INT NOT NULL,
    charge_percentage NUMERIC(5, 2) DEFAULT 0,
    total_charge_amount NUMERIC(15, 2) DEFAULT 0,
    total_payable_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
