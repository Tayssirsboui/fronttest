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
  selectedProjet!: Projet;

  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // 📊 Statistiques
  totalTaches: number = 0;
  tachesTerminees: number = 0;
  pourcentageTerminees: number = 0;
  tachesAFaire: number = 0;
  tachesEnCours: number = 0;
  prioriteHaute: number = 0;
  prioriteMoyenne: number = 0;
  prioriteFaible: number = 0;
  totalCollaborateurs: number = 0;

  // 🧁 Graphiques
  chartStatutLabels = ['À faire', 'En cours', 'Terminé'];
  chartStatutData: number[] = [];

  chartPrioriteLabels = ['Haute', 'Moyenne', 'Faible'];
  chartPrioriteData: number[] = [];

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  chartColors = [
    {
      backgroundColor: ['#6c757d', '#ffc107', '#198754']
    }
  ];

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
    this.projetService.getFullProjet(projet.id).subscribe(fullProjet => {
      this.selectedProjet = fullProjet;
      this.calculerStatistiques(fullProjet);
      this.dialog.open(this.detailsModal, {
        width: '700px',
        data: this.selectedProjet
      });
    });
  }

  calculerStatistiques(projet: Projet): void {
    const taches = projet.taches || [];
    const collaborations = projet.collaborations || [];

    this.totalTaches = taches.length;
    this.tachesTerminees = taches.filter(t => t.statut === 'Terminé').length;
    this.pourcentageTerminees = this.totalTaches > 0
      ? Math.round((this.tachesTerminees / this.totalTaches) * 100)
      : 0;

    this.tachesAFaire = taches.filter(t => t.statut === 'À faire').length;
    this.tachesEnCours = taches.filter(t => t.statut === 'En cours').length;

    this.prioriteHaute = taches.filter(t => t.priorite === 'Haute').length;
    this.prioriteMoyenne = taches.filter(t => t.priorite === 'Moyenne').length;
    this.prioriteFaible = taches.filter(t => t.priorite === 'Faible').length;

    this.totalCollaborateurs = collaborations.length;

    this.chartStatutData = [this.tachesAFaire, this.tachesEnCours, this.tachesTerminees];
    this.chartPrioriteData = [this.prioriteHaute, this.prioriteMoyenne, this.prioriteFaible];
  }

  supprimerProjet(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projetService.deleteProjet(id).subscribe(() => {
        this.chargerProjets();
      });
    }
  }
}
