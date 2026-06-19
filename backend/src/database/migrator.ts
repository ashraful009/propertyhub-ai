import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
});

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
function getMigrationFiles(direction: 'up' | 'down'): string[] {
  const allFiles = fs.readdirSync(MIGRATIONS_DIR);
  return allFiles
    .filter((f) => f.endsWith('.sql') && f.includes(`_${direction}_`))
    .sort();
}

function getMigrationVersion(filename: string): string {
  return filename.split('_')[0];
}

function getMigrationLabel(filename: string): string {
  return filename.replace(/_up_|_down_/, '_').replace('.sql', '');
}

async function getAppliedMigrations(): Promise<string[]> {
  const result = await pool.query(
    `SELECT name FROM _migrations ORDER BY id ASC`
  );
  return result.rows.map((r: any) => r.name);
}
async function migrateUp(): Promise<void> {
  await ensureMigrationsTable();

  const applied = await getAppliedMigrations();
  const upFiles = getMigrationFiles('up');

  const pending = upFiles.filter((f) => {
    const label = getMigrationLabel(f);
    return !applied.includes(label);
  });

  if (pending.length === 0) {
    console.log('✅  No pending migrations. Database is up to date.');
    return;
  }

  console.log(`📦  Found ${pending.length} pending migration(s).\n`);

  for (const file of pending) {
    const label = getMigrationLabel(file);
    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        `INSERT INTO _migrations (name) VALUES ($1)`,
        [label]
      );
      await client.query('COMMIT');
      console.log(`  ✔  Applied: ${file}`);
    } catch (error: any) {
      await client.query('ROLLBACK');
      console.error(`  ✖  FAILED:  ${file}`);
      console.error(`     ${error.message}`);
      process.exit(1);
    } finally {
      client.release();
    }
  }

  console.log('\n🎉  All migrations applied successfully.');
}
async function migrateDown(): Promise<void> {
  await ensureMigrationsTable();

  const applied = await getAppliedMigrations();

  if (applied.length === 0) {
    console.log('⚠️   No migrations to rollback.');
    return;
  }
  const lastApplied = applied[applied.length - 1];
  const version = lastApplied.split('_')[0];
  const downFiles = getMigrationFiles('down');
  const downFile = downFiles.find((f) => getMigrationVersion(f) === version);

  if (!downFile) {
    console.error(`  ✖  No down migration found for version ${version}.`);
    process.exit(1);
  }

  const filePath = path.join(MIGRATIONS_DIR, downFile);
  const sql = fs.readFileSync(filePath, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query(
      `DELETE FROM _migrations WHERE name = $1`,
      [lastApplied]
    );
    await client.query('COMMIT');
    console.log(`  ⏪  Rolled back: ${downFile}`);
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`  ✖  ROLLBACK FAILED: ${downFile}`);
    console.error(`     ${error.message}`);
    process.exit(1);
  } finally {
    client.release();
  }
}
async function migrateStatus(): Promise<void> {
  await ensureMigrationsTable();

  const applied = await getAppliedMigrations();
  const upFiles = getMigrationFiles('up');

  console.log('\n┌──────────────────────────────────────────────────┐');
  console.log('│              Migration Status                    │');
  console.log('├──────────────────────────────────────────────────┤');

  for (const file of upFiles) {
    const label = getMigrationLabel(file);
    const status = applied.includes(label) ? '✔ applied' : '◻ pending';
    console.log(`│  ${status}  │  ${file}`);
  }

  console.log('└──────────────────────────────────────────────────┘\n');
}
async function main(): Promise<void> {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'up':
        await migrateUp();
        break;
      case 'down':
        await migrateDown();
        break;
      case 'status':
        await migrateStatus();
        break;
      default:
        console.log('Usage: ts-node migrator.ts <up|down|status>');
        process.exit(1);
    }
  } catch (error: any) {
    console.error('Migration runner error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
