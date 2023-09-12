import { NextFunction, Router, Request, Response } from "express";
import { Job } from "../../models/jobs";
import { currentUser } from "../../../common";
import { requireAuth } from "../../../common";
import { JobOverview, JobSortOverview } from "../../dto/jobs";
import { User } from "../../models/user";
import { UserScores } from "../../models/scores";
import mongoose from "mongoose";
import { computeScoresForAllJobs } from "../../algo/score";

const router = Router()

router.get('/api/jobs', currentUser, requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser?.email) {
        return next(new Error("User not logged in"));
    }

    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const filter = {
            Resume: req.query.Resume ? Array.isArray(req.query.Resume) ? req.query.Resume : [req.query.Resume] : [],
            'Date Posted': req.query['Date Posted'] ? Array.isArray(req.query['Date Posted']) ? req.query['Date Posted'] : [req.query['Date Posted']] : [],
            Location: req.query.Location ? Array.isArray(req.query.Location) ? req.query.Location : [req.query.Location] : [],
            Company: req.query.Company ? Array.isArray(req.query.Company) ? req.query.Company : [req.query.Company] : []
        };

        let query: Partial<JobOverview> = {};

        const sortByResume = Array.isArray(req.query.Resume) && req.query.Resume[0] === 'Resume';

        // Location filter
        const locationFilter: string[] = filter.Location.map(String);
        if (filter.Location.length > 0) {
            query['job_location'] = { $in: locationFilter };
        }

        // Company filter
        const companyFilter: string[] = filter.Company.map(String);
        if (filter.Company.length > 0) {
            query['company_name'] = { $in: companyFilter };
        }

        let sortQuery: Partial<JobSortOverview> = {};

        // Date posted filter
        if (filter['Date Posted'].includes('Latest First')) {
            sortQuery['job_posting_date'] = -1;
        } else if (filter['Date Posted'].includes('Oldest First')) {
            sortQuery['job_posting_date'] = 1;
        }

        let jobs = await Job.find(query).sort(sortQuery).skip(skip).limit(limit);

        if (sortByResume) {
            if (!req.currentUser?.email) return next(new Error("User not logged in"));

            const userScores = await UserScores.findOne({ userId: req.currentUser.email });

            if (!userScores) {
                const scores = await computeScoresForAllJobs(req.currentUser.email);
                const newUserScores = new UserScores({ userId: req.currentUser.email, scores });
                await newUserScores.save();
            } else {

            }
        }

        res.json({ success: true, data: jobs });
    } catch (error) {
        const err: CustomError = new Error("Internal Server Error");
        err.status = 500;
        console.error("Error fetching jobs:", error);
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

router.get('/api/jobs/topData', async (req: Request, res: Response) => {
    try {
        const topLocations = await Job.aggregate([
            { $group: { _id: "$job_location", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            { $project: { location: "$_id", _id: 0 } }
        ]);

        const topCompanies = await Job.aggregate([
            { $group: { _id: "$company_name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            { $project: { company: "$_id", _id: 0 } }
        ]);
        res.json({
            topLocations: topLocations.map(l => l.location),
            topCompanies: topCompanies.map(c => c.company)
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching top data." });
    }
});
  
export { router as jobsRouter }
