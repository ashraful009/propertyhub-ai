CREATE TYPE application_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE vendor_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    full_address TEXT,
    company_mail VARCHAR(255),
    phone VARCHAR(50),
    document_url TEXT,
    status application_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
