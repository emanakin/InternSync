import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { catchError, tap, throwError } from "rxjs";
import { Router } from '@angular/router';
import { User } from "../dto/user.model";
import jwt_decode from 'jwt-decode';
import { AuthToken } from "../dto/authToken.model";
import { environment } from "src/environments/environment";

const apiEndpoint = environment.apiEndpoint;

@Injectable({ providedIn: 'root' })
export class AuthService {
    
    constructor(private http: HttpClient, private router: Router) {}

    /**
     *   Sends a signup request to the backend to create a new user account.
     *
     *   @param {string} email - The email address of the user to be registered.
     *   @param {string} password - The password for the user's account.
     *   @returns {Observable<User>} 
     * 
     *   An observable that emits the authenticated user data upon successful signup.
     *   It includes details such as user info and authentication token.
     *   In case of an error, it emits an error message string.
     * 
     *   @throws {string} - Throws an error message if the signup process encounters an error.
     */
    signup(user: User) {
        return this.http.post<User>(
            apiEndpoint+'signup', { user })
        .pipe(  
            catchError(errorRes => {
                let errorMessage = 'An unknown error occurred!';
                if (errorRes.error && errorRes.error.message) {
                    errorMessage = errorRes.error.message +': ' + errorRes.status;
                }
                console.log(errorMessage);
                return throwError(errorMessage);
            }) 
        );
    }

    /**
     *   Sends a login request to the backend to authenticate a user.
     *
     *   @param {string} email - The email address of the user to be registered.
     *   @param {string} password - The password for the user's account.
     *   @returns {Observable<User>} 
     * 
     *   An observable that emits the authenticated user data upon successful signup.
     *   It includes details such as user info and authentication token.
     *   In case of an error, it emits an error message string.
     * 
     *   @throws {string} - Throws an error message if the signup process encounters an error.
     */
    login(user: User) {
        console.log('user in auth service', user)
        return this.http.post<User>(
        apiEndpoint+'login',{ user })
        .pipe(
            catchError(errorRes => {
                let errorMessage = 'An unknown error occurred!';
                if (errorRes.error && errorRes.error.message) {
                    errorMessage = errorRes.error.message +': ' + errorRes.status;
                }
                console.log(errorMessage);
                return throwError(errorMessage);
            }) 
        );
    }

    getToken(): string {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            return null;  // or handle this case as you see fit
        }
        return JSON.parse(storedToken);
    }

    removeToken(): void {
        localStorage.removeItem('token');
    }

    getUserId(): string {
        const token = this.getToken();
        if (!token) return null;
        const decodedToken: AuthToken = jwt_decode(token);
        return decodedToken.userId;
    }

    getDecodedToken(): AuthToken {
        const token = this.getToken();
        if (!token) return null;
        const decodedToken: AuthToken = jwt_decode(token);
        console.log('token fetched:', decodedToken)
        return decodedToken;
    }

    getEmail() {
        let token: AuthToken = this.getDecodedToken()
        return token.email
    }

    getResumeRef() {
        let token: AuthToken = this.getDecodedToken();
        return token.resumeUrl;
    }
}


