import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from 'src/app/services/services/authentification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/services/models/user';
import { UserControllerService } from 'src/app/services/services/user-controller.service';

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css']
})
export class WebcamComponent implements OnInit {
  webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();
  capturedImage: string = '';
  matchFound!: boolean;
  message = '';
  messageColor = '';
  id!: number;
  user!: User;
  email = '';
  password = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private Ac: ActivatedRoute,
    private userService: UserControllerService,
    private router: Router,
    private authService: AuthentificationService
  ) { }

  get triggerObservable() {
    return this.trigger.asObservable();
  }

  ngOnInit(): void {
    this.id = this.Ac.snapshot.params['id'];
    if (this.id != null) {
      this.userService.getUserById({ id: this.id }).subscribe({

        next: (data) => {
          this.user = data;
          console.log('User Data:', this.user.email);
          console.log('Roles:', this.user.roles);
        },
        error: (err) => {
          console.error('Error fetching user:', err);
          this.errorMessage = 'Error fetching user details.';
        }
      });
    }
  }

  takeSnapshot(): void {
    this.trigger.next();
    this.login();
  }

  makeUpload(): void {
    this.trigger.next();
    this.uploadImage();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.capturedImage = webcamImage.imageAsDataUrl;
    console.log('Captured Image:', webcamImage.imageAsBase64);
  }

  uploadImage(): void {
    const base64Data = this.capturedImage.split(',')[1];
    const blob = this.base64ToBlob(base64Data, 'image/jpeg');
    const formData = new FormData();
    formData.append('file1', blob, 'photo.jpg');

    this.http.post(`http://localhost:5300/api/facial/upload?id=${this.user.idUser}`, formData).subscribe({
      next: (res) => {
        console.log('Image uploaded!', res);
        this.router.navigate(['/backoffice/user/profile/' + this.id]);
      },
      error: (err) => console.error('Error uploading image:', err)
    });
  }

  sendImage(): void {
    const base64Data = this.capturedImage.split(',')[1];
    const blob = this.base64ToBlob(base64Data, 'image/jpeg');
    const formData = new FormData();
    formData.append('file1', blob, 'photo.jpg');

    this.http.post<{ result: string }>('http://localhost:5300/api/facial/compare-faces', formData).subscribe({
      next: (res) => {
        const parsedResult = JSON.parse(res.result);
        this.matchFound = parsedResult.match;

        if (parsedResult.match) {
          this.message = '✅ Faces matched!';
          this.messageColor = 'green';
        } else {
          this.message = '❌ Faces do not match.';
          this.messageColor = 'red';
        }
      },
      error: (err) => console.error('Error sending image:', err)
    });
  }

  login(): void {
    this.errorMessage = '';

    const base64Data = this.capturedImage.split(',')[1];
    const blob = this.base64ToBlob(base64Data, 'image/jpeg');
    const formData = new FormData();
    formData.append('file1', blob, 'photo.jpg');

    this.http.post<any>('http://localhost:5300/api/facial/compare-faces', formData).subscribe({
      next: (response) => {
        if (response.message) {
          this.messageColor = 'red';
          this.errorMessage = 'Face not recognized. Please try again.';
        }
        if (response.token) {
          this.authService.saveToken(response.token);
          // Decode the token using JWT decode method
          const decodedToken = this.authService.decodeToken(response.token);

          // Check user status and roles based on the decoded token
          const userRole = decodedToken?.role?.[0]?.role;
          if (userRole === 'Admin' || userRole === 'Entrepreneur') {
            this.router.navigate(['/back']);
          }
          else {
            this.router.navigate(['/home']);
          }

        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Incorrect email or password.';
        } else {
          this.errorMessage = 'An error has occurred. Please try again.';
        }
      },
      complete: () => {
        console.log('Login complete');
      }
    });
  }

  base64ToBlob(base64: string, mime: string): Blob {
    const byteChars = atob(base64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNums);
    return new Blob([byteArray], { type: mime });
  }
}
