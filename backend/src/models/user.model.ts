export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}
