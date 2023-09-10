import { FilterObj } from "./filterProps.model";

export interface JobOverview {
    _id: string; 
    job_position: string;
    job_link: string;
    company_name: string;
    company_profile: string;
    job_location: string;
    job_posting_date: Date;
    job_company?: string;
    job_details?: {}; 
}

export interface QuickApplyJobs {
    job_company: string;
    job_link: string;
    job_location: string;
    job_position: string;
    job_posting_time: string;
}

export interface Recruiter {
    recruiter_name: string;
    recruiter_title: string;
}

// TODO: fix data format remove capilization on keys
export interface JobDetail {
    job_position: string;
    job_location: string;
    company_name: string;
    company_linkedin_id: string;
    job_posting_time: string; 
    job_description: string;
    Seniority_level: string;
    Employment_type: string;
    Job_function: string;
    Industries: string;
    recruiter_details: Recruiter;
    similar_jobs: QuickApplyJobs[]; 
    people_also_viewed: QuickApplyJobs[];
    description: string;
    requirements: string;
}

export interface Job extends JobOverview {
    job_details: [JobDetail];
}

export interface JobStateModel {
    jobs: Job[];
    selectedJob: Job | null;
    isLoading: boolean;
    totalJobs: number;
    topLocations: string[];
    topCompanies: string[];
    filter: FilterObj
}