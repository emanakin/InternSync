import express, { Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import cookieSession from 'cookie-session';
import {  } from 'express';
import { loginRouter, signupRouter } from './routers';
import { logoutRouter } from './routers/auth/logout';
import { jobsRouter } from './routers/jobs/fetch-jobs';
import { s3Router } from './routers/aws/s3Routes';
import { resumeRouter } from './routers/user/resume';
import path from 'path';


dotenv.config();
const app = express();

app.set('trust proxy', true);





// set to true when deployed
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development'
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(s3Router);
app.use(signupRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(jobsRouter);
app.use(resumeRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});  

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
    if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY required!');
    if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY required!');
    
    try {
        await mongoose.connect(process.env.MONGO_URL)
    } catch (err) {
        throw new Error('Database connection rror')
    }

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1' ,
        apiVersions: {
            s3: '2006-03-01', // replace with your desired version
        }
    });
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}

start()

