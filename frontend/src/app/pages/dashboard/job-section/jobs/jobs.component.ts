import { Component, OnInit } from '@angular/core';
import { JobsService } from 'src/app/services/jobs.service';
import { Job } from 'src/app/dto/job.model';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {
  jobs: Job[] = [];  
  currentPage = 1;
  scrollDistance = 1.5;
  scrollUpDistance = 1.5;
  throttle = 300;

  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobsService.getJobs(this.currentPage).subscribe(response => {
      if (response.success) {
        console.log(response.data)
        this.jobs.push(...response.data); 
        this.currentPage++;  
      } else {
        console.error("Error fetching jobs:", response.error);
      }
    });
  }

  onScrollDown(): void {
    this.loadJobs();  
  }
}
