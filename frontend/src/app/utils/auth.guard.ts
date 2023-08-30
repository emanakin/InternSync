import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import jwt_decode from 'jwt-decode';
import { JwtPayload } from 'jwt-decode';
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

        // If there is no token redirect to login page
        if (!token) {
            this.router.navigate(['/login']);
            return false;
        }

        const decodedToken: AuthToken = jwt_decode(token);
        const currentTime = new Date().getTime() / 1000;
        
        // If token is invalid redirect to login page
        if (decodedToken.exp < currentTime) {
            this.router.navigate(['/login']);
            return false;
        }

        // If token is valid and user is trying to access login or signup, redirect them to dashboard.
        if(state.url === '/login' || state.url === '/signup') {
            this.router.navigate(['/dashboard']);
            return false;
        }

        return true;
    }
}