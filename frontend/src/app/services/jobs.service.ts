import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Job } from '../dto/job.model';
import { AuthService } from './auth.service';
import { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JobsService {

  private readonly API_URL = '/api/jobs';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getJobs(page: number = 1): Observable<any> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
      .set('page', page.toString());

    return this.http.get<Job>('http://localhost:3000/api/jobs', { params })
      .pipe(
          catchError(errorRes => {
              let errorMessage = 'An unknown error occurred!';
              if (errorRes.error && errorRes.error.error) {
                  errorMessage = errorRes.error.error;
              }
              console.log(errorMessage);
              return throwError(errorMessage);
          }) 
      );
  }
}
