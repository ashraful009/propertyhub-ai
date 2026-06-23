export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  profile_photo?: string;
  phone?: string;
  address?: string;
  district?: string;
  created_at?: Date;
  updated_at?: Date;
}
