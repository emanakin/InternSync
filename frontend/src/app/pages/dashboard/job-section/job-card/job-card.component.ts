import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Job, JobOverview } from 'src/app/dto/job.model';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job: Job;
  @Input() selectedJob: Job | null = null;
  @Output() jobClicked = new EventEmitter<Job>();

  handleClick(): void {
    console.log('Card was clicked');
    this.jobClicked.emit(this.job);
  }
}
