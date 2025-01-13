// Import necessary modules
import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import errorHandler from './Middleware/error'; // Ensure this file is also in TypeScript

// Initialize the Express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Route Imports 
// import front from './Routes/frontRoutes';

// // Define routes
// app.use('/api/v1', front);

// // Middleware for error handling
// app.use(errorHandler);

// Export the app
export default app;