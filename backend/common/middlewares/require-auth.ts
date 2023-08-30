import { Router, Request, Response, NextFunction } from 'express'

const router = Router();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) return next (new Error('not athorized'));

    next()
};