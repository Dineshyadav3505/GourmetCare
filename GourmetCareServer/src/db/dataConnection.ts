import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT) || 5432,
});

pool
.connect()
.then((client) => {
    console.log("Successfully connected to PostgreSQL database");
    client.release();
})
.catch((error) => {
    console.error("PostgreSQL Connection Error:", error);
    process.exit(1);
});

export default pool;
