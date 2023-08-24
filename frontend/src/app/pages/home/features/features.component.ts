import { Component } from '@angular/core';
import { Feature } from 'src/app/dto/feature.model';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})

export class FeaturesComponent {
  rankedKeywordSearch: Feature = {
    title: 'Ranked Keyword Search',
    subtitle: 'Elevate your job search with our intelligent Ranked Keyword Search. By indexing and analyzing your resume, our system extracts pivotal keywords to pair you with jobs that resonate with your experience and skills.',
    iconPath: 'assets/ph_list-magnifying-glass.svg'
  };

  jobFiltering: Feature = {
    title: 'Advanced Job Filtering',
    subtitle: 'Navigate the job market with pinpoint precision. Whether you are particular about location, prefer fresh postings, or want a visually appealing interface to interact with, we tailored the experience for you.',
    iconPath: 'assets/sliding-bar.svg'
  };

  appTracking: Feature = {
    title: 'Application Tracking',
    subtitle: 'Stay on top of your job applications with our integrated Application Tracking feature. Whether you are waiting for a response, prepping for an interview, or moving onto the next round, we got you covered.',
    iconPath: 'assets/fluent-mdl2_issue-tracking.svg'
  };

}
