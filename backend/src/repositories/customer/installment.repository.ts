import pool from '../../config/db';
import { IInstallmentPlan } from '../../models/customer/installment.model';

// ১. Installment Plan ebong tar shobgulo Milestones ekshathe generate kora (Database Transaction)
export const createInstallmentPlanInDb = async (bookingId: string, totalDue: number, totalInstallments: number): Promise<any> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN'); // Transaction Start

    // Realtime backend calculation onujayi charge set kora
    let chargePercentage = 0;
    if (totalInstallments > 6 && totalInstallments <= 10) chargePercentage = 5;
    else if (totalInstallments > 10 && totalInstallments <= 15) chargePercentage = 7;
    else if (totalInstallments > 15 && totalInstallments <= 24) chargePercentage = 10;

    const totalChargeAmount = totalDue * (chargePercentage / 100);
    const totalPayableAmount = Number(totalDue) + Number(totalChargeAmount);
    const perInstallmentAmount = totalPayableAmount / totalInstallments;

    // Installment Plan Master table e insert kora
    const planQuery = `
      INSERT INTO installment_plans (booking_id, total_due_amount, number_of_installments, charge_percentage, total_charge_amount, total_payable_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const planValues = [bookingId, totalDue, totalInstallments, chargePercentage, totalChargeAmount, totalPayableAmount];
    const planResult = await client.query(planQuery, planValues);
    const createdPlan = planResult.rows[0];

    // Loop chaliye milestone gulo generate kora (Prottek mase 1ta kore date barano)
    for (let i = 1; i <= totalInstallments; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i); // 30 days interval automatic backend calculation

      const milestoneQuery = `
        INSERT INTO installment_milestones (plan_id, installment_number, amount, due_date)
        VALUES ($1, $2, $3, $4);
      `;
      await client.query(milestoneQuery, [createdPlan.id, i, perInstallmentAmount, dueDate.toISOString().split('T')[0]]);
    }

    await client.query('COMMIT'); // Commit Transaction
    return createdPlan;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error in generating installments transaction:", error);
    throw error;
  } finally {
    client.release();
  }
};

// ২. Customer panel e show korar jonno full installment schedule fetch kora
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