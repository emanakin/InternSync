import { Router, Request, Response, NextFunction } from 'express'

const router = Router();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        const err: CustomError = new Error('Not authenicated');
        err.status = 401
        return next(err);
    }
    next();
};