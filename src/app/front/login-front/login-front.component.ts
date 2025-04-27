import { Component, OnInit } from '@angular/core';
import { AuthentificationRequest } from '../../services/models/authentification-request';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login-front',
  templateUrl: './login-front.component.html',
  styleUrls: ['./login-front.component.css']
})
export class LoginFrontComponent implements OnInit {
  authRequest: AuthentificationRequest = { email: '', motDePasse: '' };
  errorMsg: Array<string> = [];
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthentificationService,
    private tokenService: TokenService
  ) { }

  ngOnInit() {

    const rootParams = new URLSearchParams(window.location.search);
    const rootToken = rootParams.get('token');
    if (rootToken) {
      this.handleToken(rootToken);
      window.history.replaceState({}, '', window.location.pathname);
    }

    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const hashToken = hashParams.get('token');
    if (hashToken) {
      this.handleToken(hashToken);
      // Clean hash fragment
      this.router.navigate(['home'], {
        queryParams: { token: null },
        replaceUrl: true
      });
    }

  }


  private handleToken(token: string) {
    try {
      if (typeof localStorage === 'undefined') {
        throw new Error('localStorage not available');
      }

      localStorage.setItem('token', token);
      this.tokenService.token = token;

      const payload = this.decodeTokenPayload(token);
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      localStorage.setItem('user', JSON.stringify(payload));
      this.router.navigateByUrl('http://localhost:4200');

    } catch (e) {
      console.error('Token handling error:', e);
      this.errorMsg.push('Erreur de connexion. Veuillez réessayer.');
    }
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/google';
  }
  loginWithGithub() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/github';
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  loginWithFacebook() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/facebook';
  }
  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Token decoding error:', e);
      return null;
    }
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({ body: this.authRequest }).subscribe({
      next: (res: any) => {
        this.handleToken(res.token);
       this.router.navigate(['cam']);
        // this.router.navigate(['home']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMsg = err.error?.validationErrors ||
          [err.error?.message || 'Une erreur est survenue'];
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}