"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobsRouter = void 0;
const express_1 = require("express");
const jobs_1 = require("../../models/jobs");
const common_1 = require("../../../common");
const common_2 = require("../../../common");
const scores_1 = require("../../models/scores");
const score_1 = require("../../algo/score");
const router = (0, express_1.Router)();
exports.jobsRouter = router;
router.get('/api/jobs', common_1.currentUser, common_2.requireAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.email)) {
        return next(new Error("User not logged in"));
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const filter = {
            Resume: req.query.Resume ? Array.isArray(req.query.Resume) ? req.query.Resume : [req.query.Resume] : [],
            'Date Posted': req.query['Date Posted'] ? Array.isArray(req.query['Date Posted']) ? req.query['Date Posted'] : [req.query['Date Posted']] : [],
            Location: req.query.Location ? Array.isArray(req.query.Location) ? req.query.Location : [req.query.Location] : [],
            Company: req.query.Company ? Array.isArray(req.query.Company) ? req.query.Company : [req.query.Company] : []
        };
        let query = {};
        const sortByResume = Array.isArray(req.query.Resume) && req.query.Resume[0] === 'Resume';
        // Location filter
        const locationFilter = filter.Location.map(String);
        if (filter.Location.length > 0) {
            query['job_location'] = { $in: locationFilter };
        }
        // Company filter
        const companyFilter = filter.Company.map(String);
        if (filter.Company.length > 0) {
            query['company_name'] = { $in: companyFilter };
        }
        let sortQuery = {};
        // Date posted filter
        if (filter['Date Posted'].includes('Latest First')) {
            sortQuery['job_posting_date'] = -1;
        }
        else if (filter['Date Posted'].includes('Oldest First')) {
            sortQuery['job_posting_date'] = 1;
        }
        let jobs = yield jobs_1.Job.find(query).sort(sortQuery).skip(skip).limit(limit);
        if (sortByResume) {
            if (!((_b = req.currentUser) === null || _b === void 0 ? void 0 : _b.email))
                return next(new Error("User not logged in"));
            const userScores = yield scores_1.UserScores.findOne({ userId: req.currentUser.email });
            if (!userScores) {
                const scores = yield (0, score_1.computeScoresForAllJobs)(req.currentUser.email);
                const newUserScores = new scores_1.UserScores({ userId: req.currentUser.email, scores });
                yield newUserScores.save();
            }
            else {
            }
        }
        res.json({ success: true, data: jobs });
    }
    catch (error) {
        const err = new Error("Internal Server Error");
        err.status = 500;
        console.error("Error fetching jobs:", error);
        return next(err);
    }
}));
router.get('/api/jobs/count', common_1.currentUser, common_2.requireAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const count = yield jobs_1.Job.countDocuments();
        res.json({ totalJobs: count });
    }
    catch (err) {
        console.error("Error fetching job count:", err);
        return next(err);
    }
}));
router.get('/api/jobs/topData', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topLocations = yield jobs_1.Job.aggregate([
            { $group: { _id: "$job_location", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            { $project: { location: "$_id", _id: 0 } }
        ]);
        const topCompanies = yield jobs_1.Job.aggregate([
            { $group: { _id: "$company_name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            { $project: { company: "$_id", _id: 0 } }
        ]);
        res.json({
            topLocations: topLocations.map(l => l.location),
            topCompanies: topCompanies.map(c => c.company)
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching top data." });
    }
}));
