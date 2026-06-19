import pool from '../../database/db';
import { insertInstallmentPlan, insertInstallmentMilestone, findInstallmentScheduleByBooking } from '../../repositories/customer/installment.repository';

export class InstallmentService {
  static calculateInstallmentCharge(totalDue: number, totalInstallments: number) {
    let chargePercentage = 0;
    if (totalInstallments > 6 && totalInstallments <= 10) chargePercentage = 5;
    else if (totalInstallments > 10 && totalInstallments <= 15) chargePercentage = 7;
    else if (totalInstallments > 15 && totalInstallments <= 24) chargePercentage = 10;

    const totalChargeAmount = Number(totalDue) * (chargePercentage / 100);
    const totalPayableAmount = Number(totalDue) + totalChargeAmount;
    const perInstallmentAmount = totalPayableAmount / totalInstallments;

    return {
      chargePercentage,
      totalChargeAmount,
      totalPayableAmount,
      perInstallmentAmount
    };
  }

  static previewInstallment(totalDue: number, totalInstallments: number) {
    const { chargePercentage, totalChargeAmount, totalPayableAmount, perInstallmentAmount } = this.calculateInstallmentCharge(totalDue, totalInstallments);
    
    return {
      total_due: totalDue,
      number_of_installments: totalInstallments,
      charge_percentage: chargePercentage,
      total_charge_amount: totalChargeAmount,
      total_payable_amount: totalPayableAmount,
      per_installment_amount: perInstallmentAmount.toFixed(2),
    };
  }

  static async generateInstallmentPlan(bookingId: string, totalDue: number, totalInstallments: number) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const { chargePercentage, totalChargeAmount, totalPayableAmount, perInstallmentAmount } = this.calculateInstallmentCharge(totalDue, totalInstallments);

      const createdPlan = await insertInstallmentPlan(client, bookingId, totalDue, totalInstallments, chargePercentage, totalChargeAmount, totalPayableAmount);

      for (let i = 1; i <= totalInstallments; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i); 

        await insertInstallmentMilestone(client, createdPlan.id, i, perInstallmentAmount, dueDate.toISOString().split('T')[0]);
      }

      await client.query('COMMIT'); 
      return createdPlan;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getSchedule(bookingId: string) {
    return findInstallmentScheduleByBooking(bookingId);
  }
}
