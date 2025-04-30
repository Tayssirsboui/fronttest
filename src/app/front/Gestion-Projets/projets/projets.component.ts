import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';
import { AjouterProjetComponent } from '../ajouter-projet/ajouter-projet.component';
import { AjouterCollaborationComponent } from '../ajouter-collaboration/ajouter-collaboration.component';
import { Router } from '@angular/router';
import { ProjetService } from 'src/app/services/projet.service';
import { ProjetDetailsComponent } from '../projet-details/projet-details.component';
import { AuthentificationService } from 'src/app/services/services';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent {
  projets: Projet[] = [];
  projetsFiltres: Projet[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  userId!: number;
  userRole!: string;

  constructor(
    private projetService: ProjetService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.authService.decodeToken(token);
      this.userId = decoded?.id;
      this.userRole = decoded?.role;
    }
    this.chargerProjets();
  }

  chargerProjets(): void {
    this.projetService.getProjets().subscribe(data => {
      if (this.userRole === 'Entrepreneur') {
        // 🔥 Entrepreneur => filtrer ses projets seulement
        this.projets = data.filter(projet => projet.userId === this.userId);
      } else {
        // 🔥 Sinon Student => voir tous les projets
        this.projets = data;
      }
  
      this.projets.forEach(projet => {
        this.projetService.getProjetWithCollaborations(projet.id).subscribe(fullProjet => {
          projet.collaborations = fullProjet.collaborations;
        });
      });
  
      this.categories = Array.from(new Set(this.projets.map(p => p.categorie))).sort();
      this.applyFilters();
    });
  }
  

  filterBy(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }
  
  applyFilters(): void {
    let result = this.projets;

    if (this.searchTerm) {
      result = result.filter(p =>
        p.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      result = result.filter(p => p.categorie === this.selectedCategory);
    }

    this.totalPages = Math.ceil(result.length / this.itemsPerPage);
    this.currentPage = 1;
    this.projetsFiltres = this.paginate(result);
  }

  paginate(array: Projet[]): Projet[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return array.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.projetsFiltres = this.paginate(this.getFilteredData());
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.projetsFiltres = this.paginate(this.getFilteredData());
    }
  }

  getFilteredData(): Projet[] {
    let result = this.projets;

    if (this.searchTerm) {
      result = result.filter(p =>
        p.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      result = result.filter(p => p.categorie === this.selectedCategory);
    }

    return result;
  }

  getStatut(projet: Projet): string {
    const now = new Date();
    const dateFin = new Date(projet.dateFinPrevue);
    return now > dateFin ? 'Terminé' : 'En cours';
  }

  getBadgeClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'en cours': return 'badge badge-warning';
      case 'terminé': return 'badge badge-success';
      default: return 'badge bg-secondary text-white';
    }
  }

  getCollaborateursActuels(projet: Projet): number {
    return projet.collaborations?.length || 0;
  }

  onCollaborer(projetId: number) {
    const dialogRef = this.dialog.open(AjouterCollaborationComponent, {
      width: '500px',
      data: { projetId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chargerProjets();
      }
    });
  }

  openModal(projet?: Projet) {
    const dialogRef = this.dialog.open(AjouterProjetComponent, {
      width: '600px',
      data: projet || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projetService.getProjets().subscribe(data => {
          this.projets = data;
        });
      }
    });
  }

  onModifier(projet: Projet): void {
    const dialogRef = this.dialog.open(AjouterProjetComponent, {
      width: '600px',
      data: projet
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  supprimerProjet(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      this.projetService.deleteProjet(id).subscribe(() => {
        this.chargerProjets();
      });
    }
  }

  ouvrirDetails(projet: Projet) {
    this.dialog.open(ProjetDetailsComponent, {
      width: '700px',
      data: projet
    });
  }
}
