export interface JobQueryCriteria {
    $in?: string[];
    $gte?: Date;
    $lte?: Date;
    // Add other MongoDB operators as needed
}
  
export interface JobOverview {
    job_position?: string | JobQueryCriteria;
    job_link?: string;
    company_name?: string | JobQueryCriteria;
    company_profile?: string;
    job_location?: string | JobQueryCriteria;
    job_posting_date?: Date | JobQueryCriteria;
    job_company?: string;
    job_details?: {}; 
    resume?: string | JobQueryCriteria;
}
  
export type SortOrder = 1 | -1;

export  interface JobSortOverview {
  job_position?: SortOrder;
  job_link?: SortOrder;
  company_name?: SortOrder;
  company_profile?: SortOrder;
  job_location?: SortOrder;
  job_posting_date?: SortOrder;
  job_company?: SortOrder;
  job_details?: SortOrder;
  resume?: SortOrder;
}