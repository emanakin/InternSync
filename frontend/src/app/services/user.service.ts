import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiEndpoint = environment.apiEndpoint;

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) { }

    // Update user's resume reference
    updateResumeReference(email: string, resume: string) {
        return this.http.post(
            `${apiEndpoint}update-resume`,
            { email, resume }
        ).pipe(
            catchError(this.handleError)
        );
    }

    // Centralized error handling function
    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (errorRes.error && errorRes.error.message) {
            errorMessage = errorRes.error.message + ': ' + errorRes.status;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
    }
}
