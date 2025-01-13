import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database!');
        
        // Example query
        const res = await client.query('SELECT NOW()');
        console.log(res.rows);

    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        await client.end();
    }
}

export { connectToDatabase };
