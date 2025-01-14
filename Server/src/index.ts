import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// import { disconnectDatabase } from './db/dbConnection';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// disconnectDatabase();



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! This is a TypeScript ser.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
