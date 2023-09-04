import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Job } from 'src/app/dto/job.model';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrls: ['./job-card.component.css']
})
export class JobCardComponent {
  @Input() job: Job;
  @Input() mode: string;
  @Input() selectedJob: Job | null = null;
  @Output() jobClicked: EventEmitter<Job> = new EventEmitter<Job>();
  

  handleClick(): void {
    if (this.mode !== 'quick apply') {
      console.log('Card was clicked', this.job);
      this.jobClicked.emit(this.job);
    } else {
      return;
    }
  }

  openJobLink(job: any): void {
    const jobLink = job.job_link;
    if (jobLink) {
        window.open(jobLink, '_blank');
    }
  }

  

}
