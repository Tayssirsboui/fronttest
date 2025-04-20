import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/services/authentification.service';
import { RegistrationRequest } from 'src/app/services/models/registration-request';

@Component({
  selector: 'app-register-front',
  templateUrl: './register-front.component.html',
  styleUrls: ['./register-front.component.css']
})
export class RegisterFrontComponent {
  registerRequest: RegistrationRequest = { 
    email: '', 
    nom: '', 
    prenom: '', 
    motDePasse: '', 
    phoneNumber: '', 
    roles: 'Student' ,
    image: ''
  };
  image: string = '';
  errorMsg: Array<string> = [];
  passwordVisible: boolean = false; // To control password visibility

  constructor(
    private router: Router,
    private authService: AuthentificationService
  ) {}

  login() {
    this.router.navigate(['front/login']);
  }

  register() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
    .subscribe({
      next: () => {
        console.log('Registration successful!');

        this.router.navigate(['/activate-acount']);
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Toggle visibility state
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.registerRequest.image = reader.result as string; // 👈 base64 vers champ image
    };
    reader.readAsDataURL(file); // convert to base64
  }
}
