import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const poolConfig: any = process.env.DATABASE_URL 
    ? { connectionString: process.env.DATABASE_URL }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
      };

// Render and other cloud providers often require SSL
if (process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true') {
    poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
    console.log('Database Connected');
    
})

pool.on('error', (err: any) => {
console.log('unexpected error', err);

})

export default pool;