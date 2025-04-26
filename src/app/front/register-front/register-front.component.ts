
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthentificationResponse, RegistrationRequest } from 'src/app/services/models';
import { AuthentificationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';
import { FacialRecognitionControllerService } from 'src/app/services/services/facial-recognition-controller.service';

@Component({
  selector: 'app-register-front',
  templateUrl: './register-front.component.html',
  styleUrls: ['./register-front.component.css']
})
export class RegisterFrontComponent implements OnInit {
  loginWithGithub() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/github';
  }
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthentificationService,
    private tokenService: TokenService,
    private http: HttpClient,
    private faceRecognitionService: FacialRecognitionControllerService // 👈 Ajout

  ) { } ngOnInit(): void {
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
  loginWithFacebook() {
    window.location.href = 'http://localhost:5300/oauth2/authorize/facebook';
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  selectedFile: File | null = null; // 👈 ajouter une propriété

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // 👈 stocker l'objet File pour l'upload
      const reader = new FileReader();
      reader.onload = () => {
        this.registerRequest.image = reader.result as string; // base64 pour la BDD
      };
      reader.readAsDataURL(file);
    }
  }
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1]; // prendre la partie payload du JWT
      const decodedPayload = atob(payload); // décoder base64
      return JSON.parse(decodedPayload); // convertir en objet JSON
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
      this.router.navigateByUrl('http://localhost:4200');

    } catch (e) {
      console.error('Token handling error:', e);
      this.errorMsg.push('Erreur de connexion. Veuillez réessayer.');
    }
  }
}
