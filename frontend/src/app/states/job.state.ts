import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Job, JobStateModel } from '../dto/job.model';
import { FetchTopLocationAndCompanyData, FetchTotalJobs, LoadJobs, ResetFilter, ResetJobs, SelectJob, SetFilter, UpdateFilter } from '../actions/job.action';
import { JobsService } from '../services/jobs.service';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

@State<JobStateModel>({
    name: 'jobs',
    defaults: {
        jobs: [],
        selectedJob: null,
        isLoading: false,
        totalJobs: 0,
        topLocations: [],
        topCompanies: [],
        filter: {
            'Resume': [],
            'Date Posted': [],
            "Location": [],
            'Company': []
        }
    }
})

@Injectable({
    providedIn: 'root'
})

export class JobState {
    constructor(private jobsService: JobsService) {}

    @Selector()
    static jobs(state: JobStateModel): Job[] {
    return state.jobs;
    }

    @Selector()
    static selectedJob(state: JobStateModel): Job | null {
    return state.selectedJob;
    }

    @Action(LoadJobs)
    loadJobs(ctx: StateContext<JobStateModel>, action: LoadJobs) {
        ctx.patchState({ isLoading: true });
        console.log('Loading started');
        const filter = ctx.getState().filter;
        return this.jobsService.getJobs(action.page, filter).pipe(
            tap(response => {
                const state = ctx.getState();
                const updatedJobs = [...state.jobs, ...response.data];
                console.log('loaded jobs from store:', response.data)
                const firstJob = !state.selectedJob && updatedJobs.length > 0 ? updatedJobs[0] : state.selectedJob;
                console.log('First job: ', firstJob);
                ctx.setState({
                    ...state,
                    jobs: updatedJobs,
                    selectedJob: firstJob,
                    isLoading: false
                });
                console.log('Loading finished');
            }),
            catchError(err => {
                console.error('Error loading jobs:', err);
                ctx.patchState({ isLoading: false });
                return of(err);
            })
        );
    }

    @Action(SelectJob)
    selectJob(ctx: StateContext<JobStateModel>, action: SelectJob) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            selectedJob: action.payload
        });
    }

    @Action(FetchTotalJobs)
    getTotalJobs(ctx: StateContext<JobStateModel>) {
        return this.jobsService.getTotalJobs().pipe(
            tap(total => {
                const state = ctx.getState();
                ctx.patchState({
                    totalJobs: total
                });
            }),
            catchError(err => {
                console.error('Error fetching total jobs:', err);
                return of(err);
            })
        );
    }

    @Action(FetchTopLocationAndCompanyData)
    getTopLocationAndCompanyData(ctx: StateContext<JobStateModel>) {
        return this.jobsService.getTopLocationAndCompanyData().pipe(
            tap(data => {
                const state = ctx.getState();
                console.log("Data loaded:", data);
                ctx.patchState({
                    topLocations: data.topLocations,
                    topCompanies: data.topCompanies
                });
            }),
            catchError(err => {
                console.error('Error fetching top locations and companies:', err);
                return of(err);
            })
        );
    }
    
    @Action(SetFilter)
    setFilter(ctx: StateContext<JobStateModel>, action: SetFilter) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            filter: action.payload
        });
    }
    
    @Action(UpdateFilter)
    updateFilter(ctx: StateContext<JobStateModel>, action: UpdateFilter) {
        const state = ctx.getState();
        const updatedFilter = {
            ...state.filter,
            ...action.payload
        };
        ctx.setState({
            ...state,
            filter: updatedFilter
        });
    }
    
    @Action(ResetFilter)
    resetFilter(ctx: StateContext<JobStateModel>) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            filter: null
        });
    }
    
    @Action(ResetJobs)
    resetJobs(ctx: StateContext<JobStateModel>) {
        const state = ctx.getState();
        ctx.patchState({ jobs: [] });
    }
    
}

