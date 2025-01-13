import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World! This is a TypeScript ser.');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
