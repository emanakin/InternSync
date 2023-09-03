import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/dto/job.model';
import { Select, Store } from '@ngxs/store';
import { FetchTotalJobs, LoadJobs, SelectJob } from 'src/app/actions/job.action';
import { JobState } from 'src/app/states/job.state';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  @Select(JobState.jobs) jobs$: Observable<Job[]>;
  @Select(JobState.selectedJob) selectedJob$: Observable<Job>;
  
  currentPage = 1;
  scrollDistance = 0.1;
  throttle = 500;
  jobCount$: Observable<number>; 
  isLoading$ = this.store.select(state => state.jobs.isLoading);
  totalJobs$ = this.store.select(state => state.jobs.totalJobs);
  

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new LoadJobs(this.currentPage));
    this.jobCount$ = this.jobs$.pipe(map(jobs => jobs.length));
    this.fetchTotalJobs();  
  }

  selectJob(job: Job): void {
    this.store.dispatch(new SelectJob(job));
  }

  loadJobs(): void {
    this.store.dispatch(new LoadJobs(this.currentPage));
    this.currentPage++;
  }

  onScrollDown(): void {
    this.loadJobs();  
  }

  fetchTotalJobs(): void {
    this.store.dispatch(new FetchTotalJobs());
  } 

}
