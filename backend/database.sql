CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('ADMIN', 'VENDOR', 'CUSTOMER');  -- Role

-- User table
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'CUSTOMER',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- property manage
CREATE TYPE property_status AS ENUM ('AVAILABLE', 'BOOKED', 'SOLD');

-- Properties tabke
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
    area NUMERIC(10, 2), -- সsqure fit
    images TEXT[], -- from Cloudinary image URL 
    status property_status DEFAULT 'AVAILABLE',
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE, -- vendor id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- booking Status ENUM
CREATE TYPE booking_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE CASCADE, 
    booking_amount NUMERIC(15, 2) NOT NULL, 
    status booking_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);