import { Component } from '@angular/core';
import { Job } from 'src/app/dto/job.model';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {
  selectedJob$: Observable<Job> = this.store.select(state => state.jobs.selectedJob);
  isLoading$: Observable<boolean> = this.store.select(state => state.jobs.isLoading);


  constructor(private store: Store) { }

  ngOnInit(): void { }

  //TODO: when resume algo inplace format key words with highlight
  formatDescription(desc: string | undefined): string[] {
    if (!desc) { return []; }
    const regex = /([.!?;,:])([A-Z])|([a-z])([A-Z])/g;
    const formatted = desc.replace(regex, '$1$3|sep|$2$4');
    return formatted.split('|sep|').map(paragraph => paragraph.trim());
  }

  openJobLink(url: string): void {
      window.open(url, '_blank');
  }

  getHumanReadableDate(date: Date | string): string {
    return moment(new Date(date)).fromNow();
}

}

