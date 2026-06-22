const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrations = [
    '001_create_users',
    '002_create_properties',
    '003_create_bookings',
    '004_create_vendor_applications',
    '005_create_system_policies',
    '006_create_installment_plans',
    '007_create_installment_milestones',
    '008_create_invoices',
    '009_create_platform_commissions',
    '010_create_refunds'
  ];

  for (const m of migrations) {
    await pool.query('INSERT INTO _migrations (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [m]);
  }
  
  console.log("Migrations synced successfully! The system now knows these tables already exist.");
  process.exit(0);
}

run();
