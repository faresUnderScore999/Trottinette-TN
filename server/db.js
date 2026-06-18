import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from root folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('CRITICAL: DATABASE_URL is not defined in the environment variables.');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon serverless connections
  }
});

export default {
  query: (text, params) => pool.query(text, params),
  pool
};
