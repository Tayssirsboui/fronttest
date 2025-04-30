import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']

})
export class CreateCommunityComponent {
  community = {
    name: '',
    description: '',
    imageUrl: ''
    
  };
  userData: any;
  userId: any;
  userName: string = '';
userImage: string = '';

  constructor(private communityService: CommunityService, private router: Router) {}
  ngOnInit(): void {
  
    this.loadUserData();    

  }

  onSubmit(): void {

    this.communityService.createCommunity(this.community,this.userId).subscribe({
      next: () => {
        console.log('Communauté créée avec succès');
        this.router.navigate(['communities']);
      },
      error: (err) => {
        console.error('Erreur lors de la création', err);
      }
    });
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

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        this.userId = payload.id || payload.userId || payload._id; // selon ton token
        this.userName = payload.name || payload.username || '';      // ✅ Ajout du nom
      this.userImage = payload.image || payload.profileImage || ''; // ✅ Ajout de l'image
        console.log("Utilisateur connecté :", this.userData);
      }
    } else {
      console.error('Token non trouvé dans localStorage');
      //this.toastr.error('Utilisateur non connecté', 'Erreur');
    }
  }
}
