import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { LoadJobs, ResetJobs, SetFilter } from 'src/app/actions/job.action';
import { FilterObj } from 'src/app/dto/filterProps.model';
import { FilterService } from 'src/app/services/filterService.service';

@Component({
  selector: 'app-utilities-bar',
  templateUrl: './utilities-bar.component.html',
  styleUrls: ['./utilities-bar.component.css']
})
export class UtilitiesBarComponent {
  dropdownVisible: boolean = false;
  private destroy$ = new Subject<void>();
  selectedOption: string = 'Select';
  names: string[] = ['Resume', 'Location', 'Date Posted', 'Company'];
  filterObject: FilterObj = {
    'Resume': [],
    'Date Posted': [],
    "Location": [],
    'Company': []
  };

  constructor(
    private store: Store,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.filterService.currentOpenDropdown
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentOpen => {
          if (currentOpen !== 'applyResetDropdown') {
              this.dropdownVisible = false;
          }
      });
  }

  toggleDropdown() {
    if (this.dropdownVisible) {
      this.closeApplyResetDropdown();
  } else {
      this.filterService.changeDropdown('applyResetDropdown');
      this.dropdownVisible = true;
  }
  }
  closeApplyResetDropdown() {
    this.filterService.closeDropdowns();
    this.dropdownVisible = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  apply() {
    this.selectedOption = 'Apply';
    this.dropdownVisible = false;
    console.log('This is the filder we are sending', this.filterObject);
    this.store.dispatch(new ResetJobs());
    this.store.dispatch(new SetFilter(this.filterObject));
    this.store.dispatch(new LoadJobs());
  }

  reset() {
    this.selectedOption = 'Reset';
    this.dropdownVisible = false;
    this.filterObject = { ...{
      'Resume': [],
      'Date Posted': [],
      "Location": [],
      'Company': []
    } }; 
    this.store.dispatch(new ResetJobs());
    this.store.dispatch(new SetFilter(this.filterObject));
    this.store.dispatch(new LoadJobs());
  }

  onOptionSelected(event: { name: string, value: string, checked: boolean }) {
    if (event.checked) {
      this.filterObject[event.name].push(event.value);
    } else {
      const index = this.filterObject[event.name].indexOf(event.value);
      if (index !== -1) {
        this.filterObject[event.name].splice(index, 1);
      }
    }
    console.log(this.filterObject);
  }
}
