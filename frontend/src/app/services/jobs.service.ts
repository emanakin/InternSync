import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Job } from '../dto/job.model';
import { AuthService } from './auth.service';
import { FilterObj } from '../dto/filterProps.model';
import { environment } from 'src/environments/environment';

const apiEndpoint = environment.apiEndpoint;

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobs(page: number = 1, filter: FilterObj): Observable<any> {
    console.log('url: ', apiEndpoint);
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
      .set('page', page.toString());
    Object.keys(filter).forEach(key => {
      filter[key].forEach(value => {
          params = params.append(key, value);
      });
    });
    
    return this.http.get<Job>(apiEndpoint+'api/jobs', { headers, params })
      .pipe(
          catchError(errorRes => {
              let errorMessage = 'An unknown error occurred!';
              if (errorRes.error && errorRes.error.message) {
                  errorMessage = errorRes.error.message;
              }
              console.log(errorMessage);
              return throwError(errorMessage);
          }) 
      );
  }

  getTotalJobs(): Observable<number> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ totalJobs: number }>(apiEndpoint+'api/jobs/count', { headers })
      .pipe(
        map(response => response.totalJobs),
        catchError(error => {
          console.error("Error fetching job count:", error);
          return throwError('Error fetching job count');
        })
      );
  }

  getTopLocationAndCompanyData(): Observable<{ topLocations: string[], topCompanies: string[] }> {
    console.log('url: ', apiEndpoint);
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ topLocations: string[], topCompanies: string[] }>(
      apiEndpoint+'api/jobs/topData', { headers })
      .pipe(
        catchError(error => {
          console.error("Error fetching top data:", error);
          return throwError('Error fetching top data');
        })
      );
  }


}
