import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';
import { ProjetService } from 'src/app/services/projet.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-projets',
  templateUrl: './list-projets.component.html',
  styleUrls: ['./list-projets.component.css']
})
export class ListProjetsComponent {

  projets: Projet[] = [];
  projetsFiltres: Projet[] = [];
  selectedProjet!: Projet; // ✅ to hold selected project for modal

  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  @ViewChild('detailsModal') detailsModal!: TemplateRef<any>;

  constructor(
    private projetService: ProjetService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerProjets();
  }

  chargerProjets(): void {
    this.projetService.getProjets().subscribe(data => {
      this.projets = data;
      this.categories = Array.from(new Set(data.map(p => p.categorie))).sort();
      this.applyFilters();
    });
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
      case 'en cours': return 'badge bg-warning text-dark';
      case 'terminé': return 'badge bg-success';
      default: return 'badge bg-secondary text-white';
    }
  }

  getCollaborateursActuels(projet: Projet): number {
    return projet.collaborations?.length || 0;
  }

  ouvrirDetails(projet: Projet) {
    // 👉 Important: reload full project with taches and collaborations
    this.projetService.getFullProjet(projet.id).subscribe(fullProjet => {
      this.selectedProjet = fullProjet;
      this.dialog.open(this.detailsModal, {
        width: '700px',
        data: this.selectedProjet
      });
    });
  }

  supprimerProjet(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe(() => {
        this.chargerProjets();
      });
    }
  }
}
