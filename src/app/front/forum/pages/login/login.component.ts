import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  name: string = '';
  image: string = '';

  constructor(private router: Router) {}

  login(): void {
    const trimmedName = this.name.trim();
    const trimmedImage = this.image.trim();

    if (trimmedName !== '') {
      const user = {
        name: trimmedName,
        image: trimmedImage !== '' 
          ? trimmedImage 
          : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(trimmedName)
      };

      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/home']);
    } else {
      alert('Veuillez entrer un nom.');
    }
  }
}
