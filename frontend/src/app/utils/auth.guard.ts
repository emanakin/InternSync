import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import jwt_decode from 'jwt-decode';



@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {

        interface JwtPayload {
            exp: number;
            email: string;
            userId: string;
        }

        const token = this.authService.getToken();

        if (!token) {
            // If user is trying to access login or signup, allow them.
            if(state.url === '/login' || state.url === '/signup') {
                return true;
            }
            this.router.navigate(['/login']);
            return false;
        }

        const decodedToken: JwtPayload = jwt_decode(token);
        const currentTime = new Date().getTime() / 1000;

        if (decodedToken.exp < currentTime) {
            // token has expired
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


