import pool from '../../database/db';
export const getVendorPolicyFromDb = async (): Promise<string> => {
  const query = `SELECT content FROM system_policies WHERE policy_type = 'VENDOR_POLICY'`;
  const result = await pool.query(query);
  return result.rows[0]?.content || "No policy defined yet.";
};
