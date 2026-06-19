import pool from '../../database/db';
import { IInstallmentPlan } from '../../models/customer/installment.model';

export const insertInstallmentPlan = async (client: any, bookingId: string, totalDue: number, totalInstallments: number, chargePercentage: number, totalChargeAmount: number, totalPayableAmount: number) => {
  const planQuery = `
    INSERT INTO installment_plans (booking_id, total_due_amount, number_of_installments, charge_percentage, total_charge_amount, total_payable_amount)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const planValues = [bookingId, totalDue, totalInstallments, chargePercentage, totalChargeAmount, totalPayableAmount];
  const result = await client.query(planQuery, planValues);
  return result.rows[0];
};

export const insertInstallmentMilestone = async (client: any, planId: string, installmentNumber: number, amount: number, dueDate: string) => {
  const milestoneQuery = `
    INSERT INTO installment_milestones (plan_id, installment_number, amount, due_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await client.query(milestoneQuery, [planId, installmentNumber, amount, dueDate]);
  return result.rows[0];
};

export const findInstallmentScheduleByBooking = async (bookingId: string): Promise<any> => {
  const planQuery = `SELECT * FROM installment_plans WHERE booking_id = $1`;
  const planResult = await pool.query(planQuery, [bookingId]);
  
  if (planResult.rows.length === 0) return null;
  const plan = planResult.rows[0];

  const milestoneQuery = `SELECT * FROM installment_milestones WHERE plan_id = $1 ORDER BY installment_number ASC`;
  const milestoneResult = await pool.query(milestoneQuery, [plan.id]);

  return {
    plan,
    milestones: milestoneResult.rows
  };
};
