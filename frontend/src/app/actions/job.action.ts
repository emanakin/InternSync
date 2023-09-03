import { Job } from "../dto/job.model";

export class LoadJobs {
    static readonly type = '[Job] Load';
    constructor(public page: number = 1) {}
}

export class SelectJob {
    static readonly type = '[Job] Select';
    constructor(public payload: Job) {}
}

export class FetchTotalJobs {
    static readonly type = '[Jobs] Fetch Total Jobs';
}
