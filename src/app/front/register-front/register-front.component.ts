import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthentificationResponse, RegistrationRequest } from 'src/app/services/models';
import { AuthentificationService } from 'src/app/services/services/authentification.service';
import { TokenService } from 'src/app/services/token/token.service';
import { FacialRecognitionControllerService } from 'src/app/services/services/facial-recognition-controller.service';

@Component({
  selector: 'app-register-front',
  templateUrl: './register-front.component.html',
  styleUrls: ['./register-front.component.css']
})
export class RegisterFrontComponent implements OnInit {

  registerRequest: RegistrationRequest = {
    email: '',
    nom: '',
    prenom: '',
    motDePasse: '',
    phoneNumber: '',
    roles: 'Student',
    image: ''
  };

  image: File | null = null;
  errorMsg: string[] = [];
  passwordVisible = false;
  isLoading = false;
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthentificationService,
    private tokenService: TokenService,
    private http: HttpClient,
    private faceRecognitionService: FacialRecognitionControllerService
  ) {}

  ngOnInit(): void {
    const url = window.location.href;
    const token = new URL(url).searchParams.get('token');

    if (token) {
      this.handleToken(token);
    }
  }

  register() {
    this.errorMsg = [];
  
    this.authService.register({ body: this.registerRequest }).subscribe({
      next: (registerResponse: any) => {
        const userId = registerResponse.id;
  
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('file1', this.selectedFile);
          formData.append('id', userId.toString());
  
          this.faceRecognitionService.uploadFormData(formData).subscribe({
            next: (uploadResponse) => {
              console.log('Image uploaded successfully:', uploadResponse);
              this.router.navigate(['/activate-acount']);
            },
            error: (uploadError) => {
              console.error('Error uploading image:', uploadError);
              this.errorMsg.push('Image upload failed.');
            }
          });
        } else {
          this.router.navigate(['/activate-acount']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/google';
  }

  loginWithGithub() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/github';
  }

  loginWithFacebook() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/facebook';
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.registerRequest.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode token payload', error);
      return null;
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

      // ✅ Redirection propre vers ton dashboard
      this.router.navigate(['/front/home']);

    } catch (e) {
      console.error('Token handling error:', e);
      this.errorMsg.push('Erreur de connexion. Veuillez réessayer.');
    }
  }
}
