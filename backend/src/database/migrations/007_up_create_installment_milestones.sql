CREATE TYPE milestone_status AS ENUM ('UNPAID', 'PAID', 'LATE');

CREATE TABLE installment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES installment_plans(id) ON DELETE CASCADE,
    installment_number INT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    due_date DATE NOT NULL,
    status milestone_status DEFAULT 'UNPAID',
    stripe_charge_id VARCHAR(255),
    late_fee NUMERIC(15, 2) DEFAULT 0,
    paid_at TIMESTAMP
);
