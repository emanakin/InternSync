import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SortOption } from 'src/app/dto/sort.model'
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { FetchTopLocationAndCompanyData, ResetJobs } from 'src/app/actions/job.action';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FilterService } from 'src/app/services/filterService.service';

@Component({
  selector: 'app-sort-by',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
})
export class SortByComponent {
  @Input() sortName: string;
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  shakeEffect: boolean = false;
  isDropdownOpen: boolean = false;
  sortOptions: SortOption[] = [];

  @Select(state => state.jobs.topLocations) topLocations$: Observable<string[]>;
  @Select(state => state.jobs.topCompanies) topCompanies$: Observable<string[]>;

  private destroy$ = new Subject<void>();

  constructor(
      private store: Store, 
      private filterService: FilterService,
      private action$: Actions
    ) {
      this.filterService.currentOpenDropdown
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentOpen => {
        console.log('Current Open Dropdown:', currentOpen);
        if (currentOpen !== this.sortName) {
          this.isDropdownOpen = false;
        }
      });
    }

  ngOnInit () {
    this.populateDropdown();
    this.action$.pipe(
      ofActionSuccessful(ResetJobs),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.resetOptions();
    });
  }

  toggleDropdown() {
    console.log('Toggling dropdown for:', this.sortName);
    if (this.isDropdownOpen) {
      this.closeDropdown();
    } else {
      this.filterService.changeDropdown(this.sortName);
      this.isDropdownOpen = true;
    }
  } 

  closeDropdown() {
    this.filterService.closeDropdowns();
    this.isDropdownOpen = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getOptionsForSortName(): SortOption['values'] {
    return this.sortOptions.find(o => o.name === this.sortName)?.values || [];
  }

  onOptionChange(option) {
    if (this.sortName === 'Resume' || this.sortName === 'Date Posted') {
        // If it's a single-select dropdown, first uncheck all other options
        this.sortOptions.find(opt => opt.name === this.sortName).values.forEach(val => {
            val.checked = false;
        });
        option.checked = true; // Now check the selected option
    }
    this.optionSelected.emit({ name: this.sortName, value: option.value, checked: option.checked });
  }


  populateDropdown() {
    this.store.dispatch(new FetchTopLocationAndCompanyData());
    this.sortOptions = [
      { 
          name: 'Location', 
          values: [] 
      },
      { 
          name: 'Company', 
          values: [] 
      },
      { 
          name: 'Resume', 
          values: [
              { value: 'Resume', checked: false },
              { value: 'Normal', checked: false }
          ] 
      },
      { 
          name: 'Date Posted', 
          values: [
              { value: 'Latest First', checked: false },
              { value: 'Oldest First', checked: false }
          ] 
      }
    ];

    this.topLocations$.subscribe(locations => {
      this.sortOptions.find(opt => opt.name === 'Location').values = 
          locations.map(location => ({ value: location, checked: false }));
    });

    this.topCompanies$.subscribe(companies => {
      this.sortOptions.find(opt => opt.name === 'Company').values = 
          companies.map(company => ({ value: company, checked: false }));
    });
  }

  resetOptions() {
    this.sortOptions.forEach(option => {
      option.values.forEach(value => {
        value.checked = false;
      });
    });
  }
  
}


