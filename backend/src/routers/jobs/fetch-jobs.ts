import { NextFunction, Router, Request, Response } from "express";
import { Job } from "../../models/jobs";
import { currentUser } from "../../../common";
import { requireAuth } from "../../../common";

const router = Router()

router.get('/api/jobs', currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;  
        const limit = 10;
        const skip = (page - 1) * limit;
        const jobs = await Job.find().skip(skip).limit(limit);

        res.json({ success: true, data: jobs });
    } catch (erorr) {
        const err: CustomError = new Error("Internal Server Error");
        err.status = 500;
        console.error("Error fetching jobs:", erorr);  
        return next(err);
    }
});

router.get('/api/jobs/count', currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const count = await Job.countDocuments(); 
        res.json({ totalJobs: count });
    } catch (err) {
        console.error("Error fetching job count:", err);  
        return next(err);
    }
});

export { router as jobsRouter }
