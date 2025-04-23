import { Component, OnInit } from '@angular/core';
import { CommunityService } from 'src/app/services/community.service';
import { Router } from '@angular/router';

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
  pageSize: number = 8;
  totalCommunities: number = 0;

  constructor(private communityService: CommunityService, private router: Router) {}

  ngOnInit(): void {
    this.communityService.getAllCommunities().subscribe({
      next: (data) => {
        this.communities = data;
        this.totalCommunities = data.length;
        this.updateFilteredCommunities(); // Initialise les communautés filtrées avec toutes les communautés
      },
      error: (err) => console.error('Erreur de récupération des communautés', err)
    });
  }

  updateFilteredCommunities(): void {
    // Appliquer la recherche sur les communautés
    let communitiesToDisplay = this.communities;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      communitiesToDisplay = this.communities.filter(c =>
        c.name.toLowerCase().includes(term)
      );
    }

    // Calculer l'index de départ et de fin en fonction de la page actuelle
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    // Mettre à jour filteredCommunities avec la pagination
    this.filteredCommunities = communitiesToDisplay.slice(start, end);
    this.totalCommunities = communitiesToDisplay.length; // Mettre à jour le total des communautés filtrées
  }

  onSearchChange(): void {
    // Réinitialiser à la première page lors d'une nouvelle recherche
    this.currentPage = 1;
    this.updateFilteredCommunities();
  }

  goToCommunity(id: number) {
    this.router.navigate(['/community', id]);
  }

  createCommunity() {
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
}
