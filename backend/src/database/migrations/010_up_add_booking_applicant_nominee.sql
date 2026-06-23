-- Add applicant and nominee info columns to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS applicant_info JSONB;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS nominee_info JSONB;
