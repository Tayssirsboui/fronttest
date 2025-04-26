import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthentificationService} from '.././services/services/authentification.service';
import {skipUntil} from 'rxjs';


@Component({
  selector: 'app-activate-acount',
  templateUrl: './activate-acount.component.html',
  styleUrls: ['./activate-acount.component.css']
})
export class ActivateAcountComponent {

  message = '';
  isOkay = true;
  submitted = false;
  constructor(
    private router: Router,
    private authService: AuthentificationService
  ) {}

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
        this.submitted = true;
      },
      error: () => {
        this.message = 'Token has been expired or invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }

  protected readonly skipUntil = skipUntil;
}