import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,

  ) { }
  jwtHelper: JwtHelperService = new JwtHelperService();
  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      if (decodedToken?.imageVerified) {
        return true;
      }
    }

    // Redirect to login if not authenticated or token invalid
    this.router.navigate(['/login']);
    return false;
  }
}
