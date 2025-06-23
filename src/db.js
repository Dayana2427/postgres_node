import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()').then(result => {
  console.log(result)
})