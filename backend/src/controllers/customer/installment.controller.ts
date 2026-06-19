import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createInstallmentPlanInDb, findInstallmentScheduleByBooking } from '../../repositories/customer/installment.repository';

// ১. Preview Installment Calculation 
export const previewInstallment = (req: Request, res: Response): void => {
  try {
    const { totalDue, totalInstallments } = req.body;

    if (!totalDue || !totalInstallments || totalInstallments > 24 || totalInstallments < 1) {
      res.status(400).json({ error: 'Invalid input. Installments must be between 1 and 24.' });
      return;
    }

    let chargePercentage = 0;
    if (totalInstallments > 6 && totalInstallments <= 10) chargePercentage = 5;
    else if (totalInstallments > 10 && totalInstallments <= 15) chargePercentage = 7;
    else if (totalInstallments > 15 && totalInstallments <= 24) chargePercentage = 10;

    const totalChargeAmount = Number(totalDue) * (chargePercentage / 100);
    const totalPayableAmount = Number(totalDue) + totalChargeAmount;
    const perInstallmentAmount = totalPayableAmount / totalInstallments;

    res.status(200).json({
      success: true,
      data: {
        total_due: totalDue,
        number_of_installments: totalInstallments,
        charge_percentage: chargePercentage,
        total_charge_amount: totalChargeAmount,
        total_payable_amount: totalPayableAmount,
        per_installment_amount: perInstallmentAmount.toFixed(2),
      }
    });
  } catch (error) {
    console.error('Error in preview calculation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ২. Generate and Save Installments
export const generateInstallments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id, totalDue, totalInstallments } = req.body;

    if (!booking_id || !totalDue || !totalInstallments) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const plan = await createInstallmentPlanInDb(booking_id, totalDue, totalInstallments);

    res.status(201).json({
      success: true,
      message: 'Installment schedule generated successfully.',
      data: plan,
    });
  } catch (error) {
    console.error('Error generating installments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ৩. Get Installment Schedule 
export const getInstallmentSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id } = req.params;
    
    const schedule = await findInstallmentScheduleByBooking(booking_id as string);

    if (!schedule) {
      res.status(404).json({ error: 'No installment plan found for this booking.' });
      return;
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Error fetching installment schedule:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};