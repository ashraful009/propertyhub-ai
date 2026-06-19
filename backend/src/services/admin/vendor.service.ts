import pool from '../../database/db';
import { AppError } from '../../errors/AppError';
import { ERROR_MESSAGES } from '../../errors/errorMessages';
import { updateApplicationStatus, updateUserRole } from '../../repositories/admin/vendor.repository';

export class AdminVendorService {
  static async reviewApplication(applicationId: string, status: string, userId: string): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await updateApplicationStatus(client, applicationId, status);

      if (status === 'APPROVED') {
        await updateUserRole(client, userId, 'VENDOR');
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new AppError(ERROR_MESSAGES.VENDOR.REVIEW_FAILED, 500);
    } finally {
      client.release();
    }
  }
}
