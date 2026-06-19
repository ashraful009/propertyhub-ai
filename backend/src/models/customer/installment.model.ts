export interface IInstallmentPlan {
  id?: string;
  booking_id: string;
  total_due_amount: number;
  number_of_installments: number;
  charge_percentage: number;
  total_charge_amount: number;
  total_payable_amount: number;
  created_at?: Date;
}

export interface IInstallmentMilestone {
  id?: string;
  plan_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status?: 'UNPAID' | 'PAID' | 'LATE';
  stripe_charge_id?: string;
  late_fee?: number;
  paid_at?: Date;
}