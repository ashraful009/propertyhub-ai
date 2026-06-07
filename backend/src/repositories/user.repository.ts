import pool from '../config/db';
import { IUser } from '../models/user.model';

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const createUser = async (userData: IUser): Promise<IUser> => {
  const query = `
    INSERT INTO users (name, email, password, role) 
    VALUES($1, $2, $3, $4) 
    RETURNING id, name, email, role
  `;
  const values = [userData.name, userData.email, userData.password, userData.role];
  const result = await pool.query(query, values);
  return result.rows[0];
};
