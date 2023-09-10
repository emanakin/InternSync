import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { FilterObj } from '../dto/filterProps.model';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
    private openDropdown = new BehaviorSubject<string | null>(null);
    public currentOpenDropdown = this.openDropdown.asObservable();

    constructor(
        private authService: AuthService,
        private http: HttpClient
        ) {}
  
    changeDropdown(dropdownId: string) {
        console.log('changeDropdown called with:', dropdownId);
        if (this.openDropdown.value !== dropdownId) {
            this.openDropdown.next(dropdownId);
        } else {
            this.openDropdown.next(null);
        }
    }
      
    closeDropdowns() {
        this.openDropdown.next(null);
    }

}
