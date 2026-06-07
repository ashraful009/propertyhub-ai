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
  vendor_id: string;
  created_at?: Date;
  updated_at?: Date;
}