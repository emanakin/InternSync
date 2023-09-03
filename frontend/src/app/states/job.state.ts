import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Job, JobStateModel } from '../dto/job.model';
import { FetchTotalJobs, LoadJobs, SelectJob } from '../actions/job.action';
import { JobsService } from '../services/jobs.service';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';

@State<JobStateModel>({
  name: 'jobs',
  defaults: {
    jobs: [],
    selectedJob: null,
    isLoading: false,
    totalJobs: 0
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
        return this.jobsService.getJobs(action.page).pipe(
            tap(response => {
                const state = ctx.getState();
                const updatedJobs = [...state.jobs, ...response.data];
                const firstJob = !state.selectedJob && updatedJobs.length > 0 ? updatedJobs[0] : state.selectedJob;
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
    
}

