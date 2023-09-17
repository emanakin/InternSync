"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Core job details
const CoreJobSchema = new mongoose_1.default.Schema({
    job_position: String,
    job_company: String,
    job_location: String,
    job_posting_time: String,
    job_link: String
}, { _id: false });
// Main job schema
const JobSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    job_position: String,
    job_link: String,
    company_name: String,
    company_profile: String,
    job_location: String,
    job_posting_date: Date,
    job_details: {
        job_position: String,
        job_location: String,
        company_name: String,
        company_linkedin_id: String,
        job_posting_time: String,
        job_description: String,
        seniority_level: String,
        employment_type: String,
        job_function: String,
        industries: String,
        recruiter_details: {
            recruiter_name: String,
            recruiter_title: String
        },
        similar_jobs: [CoreJobSchema],
        people_also_viewed: [CoreJobSchema],
        description: String,
        requirements: String
    },
    tokens: {}
});
exports.Job = mongoose_1.default.model('Job', JobSchema, 'jobs_collection');
