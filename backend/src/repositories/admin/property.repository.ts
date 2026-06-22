import pool from '../../database/db';

export const getPendingProperties = async (): Promise<any[]> => {
  const query = `
    SELECT p.*, u.name as vendor_name, u.email as vendor_email
    FROM properties p
    JOIN users u ON p.vendor_id = u.id
    WHERE p.is_approved = false
    ORDER BY p.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updatePropertyApproval = async (id: string, is_approved: boolean): Promise<boolean> => {
  if (is_approved) {
    const query = `UPDATE properties SET is_approved = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1`;
    await pool.query(query, [id]);
    return true;
  } else {
    // If rejected, we just delete it so the vendor can re-submit if needed
    const query = `DELETE FROM properties WHERE id = $1 AND is_approved = false`;
    await pool.query(query, [id]);
    return false;
  }
};
