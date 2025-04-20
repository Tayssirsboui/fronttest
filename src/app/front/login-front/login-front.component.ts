import { Component } from '@angular/core';
import { AuthentificationRequest } from '../../services/models/authentification-request';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login-front',
  templateUrl: './login-front.component.html',
  styleUrls: ['./login-front.component.css']
})
export class LoginFrontComponent {
  authRequest: AuthentificationRequest = { email: '', motDePasse: '' };
  errorMsg: Array<string> = [];

  // 👁️ Contrôle d'affichage du mot de passe
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthentificationService,
    private tokenService: TokenService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Erreur lors du décodage du token :', e);
      return null;
    }
  }

  login() {
    this.errorMsg = [];

    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        if (res.token) {
          this.tokenService.token = res.token as string;
          localStorage.setItem('token', res.token);

          const payload = this.decodeTokenPayload(res.token);
          if (payload) {
            localStorage.setItem('user', JSON.stringify(payload));
            const role = payload.role;

            if (role === 'Admin' || role === 'Entrepreneur') {
              this.router.navigate(['dashboard']);
            } else if (role === 'Student') {
              this.router.navigate(['home']);
            } else {
              this.errorMsg.push('Vous n\'avez pas accès à ce service.');
            }
          } else {
            this.errorMsg.push('Échec lors de la lecture des informations utilisateur.');
          }
        } else {
          this.errorMsg.push('Token manquant dans la réponse.');
        }
      },
      error: (err) => {
        console.log(err);
        if (err.error && err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error ? err.error : 'Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}
