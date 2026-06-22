export interface IRefund {
  id?: string;
  booking_id: string;
  total_paid: number;
  penalty_amount: number;
  refund_amount: number;
  status?: string;
  created_at?: Date;
}
