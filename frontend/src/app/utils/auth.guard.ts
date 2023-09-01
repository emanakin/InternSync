import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { AuthToken } from '../dto/authToken.model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
    
        const token = this.authService.getToken();
        console.log(token)
        let decodedToken: AuthToken;
    
        // Scenario 1: No token present
        if (!token) {
            if (state.url === '/dashboard') {
                this.router.navigate(['/login']);
                return false;
            }
            return true; 
        }
    
        // Decode token and handle exceptions
        try {
            decodedToken = jwt_decode(token);
        } catch (error) {
            console.error("Invalid token:", error);
            this.authService.removeToken(); 
            this.router.navigate(['/login']);
            return false;
        }
    
        const currentTime = new Date().getTime() / 1000;
    
        // Scenario 2: Token is expired
        if (decodedToken.exp < currentTime) {
            console.log('Token expired.');
            this.authService.removeToken(); 
            if (state.url === '/dashboard') {
                this.router.navigate(['/login']);
                return false;
            }
            return true; 
        }
    
        // Scenario 3: Token is valid
        if(state.url === '/login' || state.url === '/signup') {
            console.log('Token expires at: ' + this.unixTimestampToEST(decodedToken.exp));
            this.router.navigate(['/dashboard']);
            return false;
        }
    
        return true; // token is valid and user is trying to access other routes
    }
    

    private unixTimestampToEST(tokenTime: number): string {
        const date = new Date(tokenTime * 1000);
        const formattedDate = date.toLocaleString();
        return formattedDate;
    }

}