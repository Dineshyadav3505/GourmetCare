import dotenv from 'dotenv';
import app from './app';
import connectToDatabase from './db/dataConnection';

// Load environment variables from .env file
dotenv.config({
    path: './.env',
});

// Start the application
const startApp = async () => {
    try {
        // Connect to the database
        await connectToDatabase();

        // Start the server
        const port = process.env.PORT || 3000; // Default port if not specified
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process if unable to connect
    }
};

startApp();
