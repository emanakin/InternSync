import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import {  } from 'express';
import { currentUser, requireAuth } from '../common';
import { loginRouter, signupRouter } from './routers';
import { logoutRouter } from './routers/auth/logout';
import { jobsRouter } from './routers/jobs/fetch-jobs';

dotenv.config();
const app = express();

app.set('trust proxy', true);

// set to true when deployed
app.use(cookieSession({
    signed: false,
    secure: false
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(jobsRouter);

declare global {
    interface CustomError extends Error {
        status?: number
    }
}

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    if (error.status) {
        return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({ message: error.message })
});

const start = async () => {
    if (!process.env.MONGO_URL) throw new Error('MONGO_URL required!');
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY required!');
    
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (err) {
        throw new Error('Database connection rror')
    }

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
}

app.get('/', (req, res) => {});

start()

