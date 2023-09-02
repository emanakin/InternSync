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
  scrollDistance = 0.1;
  throttle = 500;
  isLoading = false;
  totalJobs: number;
  jobCount: number;
  selectedJob: Job | null = null;

  constructor(private jobsService: JobsService) { }

  ngOnInit(): void {
    this.fetchTotalJobs();
    this.loadJobs();
  }

  selectJob(job: Job): void {
    console.log('Job clicked:', job);
    this.selectedJob = this.selectedJob === job ? null : job; 
  }
  
  
  loadJobs(): void {
    if (this.isLoading) return; 
  
    this.isLoading = true;
  
    this.jobsService.getJobs(this.currentPage).subscribe(response => {
      if (response.success) {
        console.log(response.data);
        this.jobs.push(...response.data); 
        this.currentPage++;  

        this.jobCount = this.jobs.length;
      } else {
        console.error("Error fetching jobs:", response.error);
      }
  
      this.isLoading = false;
    });
  }

  onScrollDown(): void {
    this.loadJobs();  
  }

  fetchTotalJobs(): void {
    this.jobsService.getTotalJobs().subscribe(
      total => {
        this.totalJobs = total;
      },
      error => {
        console.error("Error fetching total jobs:", error);
      }
    );
  }
  

}
