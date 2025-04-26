import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Evenement } from 'src/app/models/evenement.model';
import { EvenementService } from 'src/app/services/evenement.service';
import { StatsEvenementModalComponent } from '../stats-evenement-modal/stats-evenement-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-gestion-evenements',
  templateUrl: './admin-gestion-evenements.component.html',
  styleUrls: ['./admin-gestion-evenements.component.css']
})
export class AdminGestionEvenementsComponent implements OnInit {
  evenements: Evenement[] = []; // En attente de validation
  evenementsApprouves: Evenement[] = []; // Approuvés

  pageIndex: number = 0;
  totalPages: number = 0;
  pageIndexInput: number = 1;

  constructor(
    private evenementService: EvenementService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.chargerEvenementsNonTraites();
    this.chargerEvenementsApprouves();
  }

  // 🔄 Charger les événements en attente
  chargerEvenementsNonTraites(): void {
    this.evenementService.getNonTraites().subscribe({
      next: data => {
        this.evenements = data;
        this.totalPages = Math.ceil(this.evenements.length / 2);
        this.pageIndex = 0;
        this.pageIndexInput = 1;
      },
      error: err => console.error('Erreur chargement en attente', err)
    });
  }

  // 🔄 Charger les événements approuvés
  chargerEvenementsApprouves(): void {
    this.evenementService.getApprouves().subscribe({
      next: data => this.evenementsApprouves = data,
      error: err => console.error('Erreur chargement approuvés', err)
    });
  }

  // 📦 Pagination - groupes de 2 événements
  paginatedEvenements(): Evenement[][] {
    const groupes: Evenement[][] = [];
    for (let i = 0; i < this.evenements.length; i += 2) {
      groupes.push(this.evenements.slice(i, i + 2));
    }
    return groupes.slice(this.pageIndex, this.pageIndex + 1);
  }

  // ⬅️ Précédent
  precedent(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.pageIndexInput = this.pageIndex + 1;
    }
  }

  // ➡️ Suivant
  suivant(): void {
    if (this.pageIndex + 1 < this.totalPages) {
      this.pageIndex++;
      this.pageIndexInput = this.pageIndex + 1;
    }
  }

  // 🧭 Aller à une page spécifique
  allerPage(): void {
    const page = this.pageIndexInput - 1;
    if (page >= 0 && page < this.totalPages) {
      this.pageIndex = page;
    } else {
      this.pageIndexInput = this.pageIndex + 1;
    }
  }

  // ✅ Accepter ou rejeter un événement
  changerStatut(id: number, statut: 'APPROUVE' | 'REJETE'): void {
    this.evenementService.changerStatut(id, statut).subscribe({
      next: () => {
        this.snackBar.open(`Événement ${statut.toLowerCase()} avec succès.`, 'Fermer', {
          duration: 3000
        });
        this.chargerEvenementsNonTraites();
        this.chargerEvenementsApprouves();
      },
      error: err => {
        console.error('Erreur modification statut', err);
        this.snackBar.open('❌ Erreur lors de la mise à jour.', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  // 📊 Voir statistiques
  ouvrirStats(evenement: Evenement): void {
    this.dialog.open(StatsEvenementModalComponent, {
      width: '600px',
      data: {
        evenementId: evenement.id,
        nbMax: evenement.nbMaxParticipants
      }
    });
  }

  // 📤 Exporter en PDF
  exportPdf(): void {
    this.evenementService.downloadPdf();
  }

  // Pour la pagination avec select
  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i);
  }

  changerPage(index: number): void {
    this.pageIndex = index;
    this.pageIndexInput = index + 1;
  }
}
