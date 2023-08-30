import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { catchError, tap, throwError } from "rxjs";
import { Router } from '@angular/router';
import { User } from "../dto/user.model";

export interface AuthResponseData {
    email: string;
    _id: string;
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'http://localhost:3000/signup',
            {
                email: email,
                password: password,
            }
        )
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

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'http://localhost:3000/login',
            {
                email: email,
                password: password,
            }
        )
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

    getToken(): string {
        return localStorage.getItem('token');
    }
    
}