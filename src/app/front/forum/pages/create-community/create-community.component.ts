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

  constructor(private communityService: CommunityService, private router: Router) {}

  onSubmit(): void {
    this.communityService.createCommunity(this.community).subscribe({
      next: () => {
        console.log('Communauté créée avec succès');
        this.router.navigate(['communities']);
      },
      error: (err) => {
        console.error('Erreur lors de la création', err);
      }
    });
  }
}
