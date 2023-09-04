import { Component, Input } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';
import { Job } from 'src/app/dto/job.model';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-quick-apply',
  templateUrl: './quick-apply.component.html',
  styleUrls: ['./quick-apply.component.css']
})
export class QuickApplyComponent {
  @Input() mode: string;

  isInitialLoad: boolean = true;

  selectedJob$: Observable<Job> = this.store.select(state => state.jobs.selectedJob);
  isLoading$: Observable<boolean> = this.store.select(state => state.jobs.isLoading);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.selectedJob$.pipe(
        filter(job => !!job)
    ).subscribe(() => this.isInitialLoad = false);
  }

}
