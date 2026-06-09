export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IVendorApplication {
  id?: string;
  user_id: string;
  company_name: string;
  location: string;
  full_address: string;
  company_mail: string;
  phone: string;
  document_url: string;
  status?: ApplicationStatus;
  created_at?: Date;
  updated_at?: Date;
}