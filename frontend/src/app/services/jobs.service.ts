import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Job } from '../dto/job.model';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobs(page: number = 1): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('page', page.toString());

    return this.http.get<Job>('http://localhost:3000/api/jobs', { headers, params })
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

    return this.http.get<{ totalJobs: number }>('http://localhost:3000/api/jobs/count', { headers })
      .pipe(
        map(response => response.totalJobs),
        catchError(error => {
          console.error("Error fetching job count:", error);
          return throwError('Error fetching job count');
        })
      );
  }

}
