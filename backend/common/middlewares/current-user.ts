import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';   

declare global {
    interface JwtPayload {
        email: string,
        userId: string
    }

    namespace Express {
        interface Request {
            currentUser?: JwtPayload
        }
    }
}

export const currentUser = ( req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }

    const token = authHeader.split(' ')[1]; 

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
        req.currentUser = payload;
    } catch (err) {
        console.log(err)
        return next(err);
    }

    next()
}