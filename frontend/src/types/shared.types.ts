export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface IProperty {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  property_type: 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL';
  status: 'AVAILABLE' | 'SOLD' | 'RENTED';
  images: string[];
  created_at: Date;
}
