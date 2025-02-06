import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';


const app = express();

dotenv.config();

// Middlewares
app.use(cors());

app.use(bodyParser.json());

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true,}));

app.use(express.json({ limit: process.env.Data_Limit }));

app.use(express.urlencoded({extended: true, limit: process.env.Data_Limit}));

app.use(express.static("public"))

app.use(cookieParser());


import userRoute from './routes/users/user.route';  

app.use('/api/v1', userRoute);

export default app;