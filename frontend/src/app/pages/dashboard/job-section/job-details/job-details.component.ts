import { Component } from '@angular/core';
import { Job, JobDetail } from 'src/app/dto/job.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {
  selectedJob$ = this.store.select(state => state.jobs.selectedJob);
  isLoading$ = this.store.select(state => state.jobs.isLoading);

  constructor(private store: Store) { }

}

