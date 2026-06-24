import pool from './db';
import { SecretUtil } from '../utils/secret.util';

const seedAdmin = async () => {
    try {
        console.log('Connecting to database...');
        const email = 'admin@gmail.com';
        const password = await SecretUtil.hashPassword('12345678');
        const role = 'ADMIN';
        const name = 'Admin';

        // Check if admin already exists
        const checkQuery = `SELECT * FROM users WHERE email = $1`;
        const { rows } = await pool.query(checkQuery, [email]);
        
        if (rows.length > 0) {
            console.log('User already exists. Updating role to ADMIN and resetting password...');
            const updateQuery = `UPDATE users SET password = $1, role = $2 WHERE email = $3`;
            await pool.query(updateQuery, [password, role, email]);
            console.log('✅ Admin user updated successfully!');
        } else {
            console.log('Creating new admin user...');
            const insertQuery = `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`;
            await pool.query(insertQuery, [name, email, password, role]);
            console.log('✅ Admin user created successfully!');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
