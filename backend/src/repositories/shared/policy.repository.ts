import pool from '../../database/db';

export const getAllPolicies = async (policyType?: string) => {
  let query = `SELECT * FROM system_policies`;
  const values: string[] = [];

  if (policyType) {
    query += ` WHERE policy_type = $1`;
    values.push(policyType);
  }

  query += ` ORDER BY created_at ASC`;
  const result = await pool.query(query, values);
  return result.rows;
};

export const getPolicyById = async (id: string) => {
  const query = `SELECT * FROM system_policies WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const insertPolicy = async (policyType: string, title: string, content: string, isMandatory: boolean = false) => {
  const query = `
    INSERT INTO system_policies (policy_type, title, content, is_mandatory)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await pool.query(query, [policyType, title, content, isMandatory]);
  return result.rows[0];
};

export const updatePolicyById = async (id: string, title: string, content: string) => {
  const query = `
    UPDATE system_policies 
    SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $3 AND is_mandatory = false
    RETURNING *
  `;
  const result = await pool.query(query, [title, content, id]);
  return result.rows[0] || null;
};

export const deletePolicyById = async (id: string) => {
  const query = `DELETE FROM system_policies WHERE id = $1 AND is_mandatory = false RETURNING *`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};
