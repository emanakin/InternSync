import { FilterObj } from "../dto/filterProps.model";
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

export class FetchTopLocationAndCompanyData {
    static readonly type = '[Jobs] Fetch Top Locations and Companies';
}

export class SetFilter {
    static readonly type = '[Job] Set Filter';
    constructor(public payload: FilterObj) {}
}

export class UpdateFilter {
    static readonly type = '[Job] Update Filter';
    constructor(public payload: Partial<FilterObj>) {}
}

export class ResetFilter {
    static readonly type = '[Job] Reset Filter';
}

export class ResetJobs {
    static readonly type = '[Jobs] Reset';
}
