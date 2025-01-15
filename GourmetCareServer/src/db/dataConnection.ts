import { Pool } from 'pg';

interface DatabaseConfig {
    user: string;
    host: string;
    database: string;
    password: string;
    port: number;
}

const connectToDatabase = async (): Promise<Pool> => {
    try {
        const config: DatabaseConfig = {
            user: process.env.DB_USER || '',
            host: process.env.DB_HOST || '',
            database: process.env.DB_NAME || '',
            password: process.env.DB_PASSWORD || '',
            port: Number(process.env.DB_PORT) || 5432,
        };

        const pool = new Pool(config);

        // Connect to the database
        await pool.connect();
        console.log('Successfully connected to PostgreSQL database');
        
        return pool; // Return the pool for further queries
    } catch (error) {
        console.error("PostgreSQL Connection Error:", error);
        process.exit(1); // Exit the process in case of an error
    }
};

export default connectToDatabase;
