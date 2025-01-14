// src/database.ts
import { Client } from 'pg';

let client: Client | null = null;

export const connectToDatabase = async () => {
    if (!client) {
        client = new Client({
            user: 'chaiaurcode', // your POSTGRES_USER
            host: 'localhost',     // host where PostgreSQL is running
            database: 'chaiDB',    // your POSTGRES_DB
            password: 'chaiaurcode', // your POSTGRES_PASSWORD
            port: 5432,            // default PostgreSQL port
        });

        await client.connect();
        console.log('Connected to PostgreSQL database');
    }

    return client;
};

export const disconnectDatabase = async () => {
    if (client) {
        await client.end();
        client = null;
        console.log('Disconnected from PostgreSQL database');
    }
};
