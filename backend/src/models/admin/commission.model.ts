export interface IPlatformCommission {
  id?: string;
  booking_id: string;
  milestone_id?: string | null;
  amount: number;
  created_at?: Date;
}
