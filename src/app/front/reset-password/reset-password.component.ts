import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordResetService } from '../../services/services/password-reset.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute

  ) {
    this.resetForm = this.fb.group({
      token: [this.token, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      console.log('Token from query param:', this.token);
      if (this.token) {
        this.resetForm.patchValue({ token: this.token });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const { token, password } = this.resetForm.value;

      this.passwordResetService.resetPassword(token, password)
        .subscribe({
          next: () => {
            this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
            this.resetForm.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          error: (error) => {
            this.errorMessage = 'Une erreur est survenue. Veuillez vérifier votre token et réessayer.';
            console.error('Erreur de réinitialisation:', error);
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
} 