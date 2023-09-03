import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Job, JobOverview } from 'src/app/dto/job.model';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job: JobOverview;
  @Input() selectedJob: Job | null = null;
  @Output() jobClicked: EventEmitter<JobOverview> = new EventEmitter<JobOverview>();
  

  handleClick(): void {
    console.log('Card was clicked');
    this.jobClicked.emit(this.job);
  }
}
