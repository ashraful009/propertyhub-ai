export interface IInvoice {
  id?: string;
  user_id: string;
  booking_id: string;
  milestone_id?: string | null;
  stripe_session_id: string;
  amount: number;
  status?: 'PENDING' | 'PAID' | 'FAILED';
  created_at?: Date;
  paid_at?: Date;
}