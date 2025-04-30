import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/services/community.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.css']
})
export class CommunityListComponent implements OnInit {
  communities: any[] = [];
  filteredCommunities: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  totalCommunities: number = 0;
  userId: number | null = null;
  userData: any;
  favoriteCommunities: any[] = [];


  constructor(private communityService: CommunityService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData(); // Récupère le userId avant d'appeler les favoris
    this.loadFavoriteCommunities();

    this.communityService.getAllCommunities().subscribe({
      next: (data) => {
        this.communities = data;
        this.totalCommunities = data.length;
        this.updateFilteredCommunities();
      },
      error: (err) => console.error('Erreur de récupération des communautés', err)
    });
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur de décodage du token', error);
      return null;
    }
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        this.userId = payload.id || payload.userId || payload._id;
        this.loadFavoriteCommunities(); // Charger les favoris après avoir récupéré l'ID utilisateur

      }
    } else {
      console.error('Token non trouvé dans localStorage');
    }
  }

 

  updateFilteredCommunities(): void {
    if (!this.communities) {
      this.filteredCommunities = [];
      this.totalCommunities = 0;
      return;
    }
  
    let communitiesToDisplay = [...this.communities]; // on copie bien
  
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      communitiesToDisplay = communitiesToDisplay.filter(c =>
        c.name?.toLowerCase().includes(term)
      );
    }

    const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
    this.filteredCommunities = communitiesToDisplay.slice(start, end);
    this.totalCommunities = communitiesToDisplay.length;
 
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updateFilteredCommunities();
  }

  goToCommunity(id: number): void {
    this.router.navigate(['/community', id]);
  }

  createCommunity(): void {
    this.router.navigate(['/create-community']);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredCommunities();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredCommunities();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalCommunities / this.pageSize);
  }
  toggleFavorite(communityId: number, event: MouseEvent): void {
    event.stopPropagation(); // Pour empêcher l’ouverture de la communauté
  
    if (!this.userId) {
      console.error('Utilisateur non connecté');
      return;
    }
  
    this.communityService.toggleFavorite(communityId, this.userId).subscribe({
      next: () => {
        console.log(`Favori ajouté pour la communauté ${communityId}`);
        Swal.fire({
          icon: 'success',
          title: 'Favori ajouté',
          text: 'La communauté a été ajoutée à vos favoris avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur lors de l’ajout aux favoris', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible d’ajouter la communauté aux favoris.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }
  loadFavoriteCommunities(): void {
    if (this.userId) {
      this.communityService.getFavorites(this.userId).subscribe({
        next: (data) => {
          this.favoriteCommunities = data;
        },
        error: (err) => console.error('Erreur de récupération des favoris', err)
      });
    }
  }
  

 
}
  