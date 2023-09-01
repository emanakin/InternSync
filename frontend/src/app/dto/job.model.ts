export interface JobOverview {
    _id: string; // ObjectId
    job_position: string;
    job_link: string;
    company_name: string;
    company_profile: string;
    job_location: string;
    job_posting_date: Date;
    job_details?: {}; // I am assuming this would be some brief about the job. 
}

export interface Recruiter {
    recruiter_name: string;
    recruiter_title: string;
}

export interface JobDetail {
    job_position: string;
    job_location: string;
    company_name: string;
    company_linkedin_id: string;
    job_posting_time: string; // This could also be of type Date if you're storing exact time
    job_description: string;
    seniority_level: string;
    employment_type: string;
    job_function: string;
    industries: string;
    recruiter_details: Recruiter;
    similar_jobs: JobOverview[]; 
    people_also_viewed: JobOverview[];
    description: string;
    requirements: string;
}

export interface Job extends JobOverview {
    job_details: JobDetail;
}
