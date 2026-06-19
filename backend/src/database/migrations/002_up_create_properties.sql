CREATE TYPE property_status AS ENUM ('AVAILABLE', 'BOOKED', 'SOLD');

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(15, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    property_type VARCHAR(100),
    bedrooms INT,
    bathrooms INT,
    area NUMERIC(10, 2), -- Square fit
    images TEXT[], -- Cloudinary image URLs
    status property_status DEFAULT 'AVAILABLE',
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
