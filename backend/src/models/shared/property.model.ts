export type PropertyStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface IProperty {
  id?: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  status?: PropertyStatus;
  is_approved?: boolean;
  vendor_id: string;
  booking_money?: number;
  total_installments?: number;
  created_at?: Date;
  updated_at?: Date;
}