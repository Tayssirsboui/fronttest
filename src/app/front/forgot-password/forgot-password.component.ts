import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from '../../services/services/password-reset.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.passwordResetService.forgotPassword(this.forgotPasswordForm.value.email)
        .subscribe({
          next: () => {
            this.successMessage = 'Un e-mail de réinitialisation a été envoyé à votre adresse.';
            this.forgotPasswordForm.reset();
          },
          error: (error) => {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
            console.error('Erreur de réinitialisation:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
} 