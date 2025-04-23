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
      next: data => this.evenements = data,
      error: err => console.error('Erreur chargement en attente', err)
    });
  }

  // 🔄 Charger les événements approuvés
  chargerEvenementsApprouves(): void {
    this.evenementService.getAll().subscribe({
      next: data => this.evenementsApprouves = data,
      error: err => console.error('Erreur chargement approuvés', err)
    });
  }

  // Pagination 2 par groupe
  paginatedEvenements(): Evenement[][] {
    const groupes: Evenement[][] = [];
    for (let i = 0; i < this.evenements.length; i += 2) {
      groupes.push(this.evenements.slice(i, i + 2));
    }
    return groupes.slice(this.pageIndex, this.pageIndex + 1);
  }

  precedent(): void {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  suivant(): void {
    const maxPages = Math.ceil(this.evenements.length / 2);
    if (this.pageIndex + 1 < maxPages) this.pageIndex++;
  }

  changerStatut(id: number, statut: 'APPROUVE' | 'REJETE'): void {
    this.evenementService.changerStatut(id, statut).subscribe({
      next: () => {
        this.snackBar.open(`Événement ${statut.toLowerCase()} avec succès.`, 'Fermer', {
          duration: 3000
        });
        // Recharger les listes après modification
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
  ouvrirStats(evenement: Evenement) {
    this.dialog.open(StatsEvenementModalComponent, {
      width: '600px',
      data: {
        evenementId: evenement.id,
        nbMax: evenement.nbMaxParticipants
      }
    });
  }
  
}

