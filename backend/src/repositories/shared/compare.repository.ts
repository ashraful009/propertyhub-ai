import pool from '../../config/db';
import { IProperty } from '../../models/shared/property.model';

export const findPropertiesById = async (ids: string[]): Promise<IProperty[]> => {
const query = `SELECT * FROM properties WHERE id = ANY($1::uuid[])`;
const result = await pool.query(query, [ids]);
return result.rows;
}
