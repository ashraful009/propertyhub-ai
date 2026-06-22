import pool from '../../database/db';
import { IPlatformCommission } from '../../models/admin/commission.model';

export const insertPlatformCommission = async (
  client: any, 
  bookingId: string, 
  amount: number, 
  milestoneId: string | null = null
): Promise<IPlatformCommission> => {
  const query = `
    INSERT INTO platform_commissions (booking_id, amount, milestone_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await client.query(query, [bookingId, amount, milestoneId]);
  return result.rows[0];
};

export const getPlatformCommissions = async (): Promise<IPlatformCommission[]> => {
  const query = `SELECT * FROM platform_commissions ORDER BY created_at DESC;`;
  const result = await pool.query(query);
  return result.rows;
};
