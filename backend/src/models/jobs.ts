import mongoose, { Schema } from "mongoose";

// Core job details
const CoreJobSchema = new mongoose.Schema({
    job_position: String,
    job_company: String,
    job_location: String,
    job_posting_time: String,
    job_link: String
}, { _id: false }); 

// Main job schema
const JobSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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

export const Job = mongoose.model('Job', JobSchema, 'jobs_collection');

