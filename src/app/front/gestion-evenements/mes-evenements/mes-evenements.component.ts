import { Component, OnInit } from '@angular/core';
import { EvenementService } from 'src/app/services/evenement.service';
import { Evenement } from 'src/app/models/evenement.model';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { EvenementModifierComponent } from '../evenement-modifier/evenement-modifier.component';

@Component({
  selector: 'app-mes-evenements',
  templateUrl: './mes-evenements.component.html',
  styleUrls: ['./mes-evenements.component.css']
})
export class MesEvenementsComponent implements OnInit {
  evenements: Evenement[] = [];
  evenementsFiltres: Evenement[] = [];
  paginatedEvenements: Evenement[] = [];

  statuts = ['Tous', 'NON_TRAITE', 'APPROUVE', 'REJETE'];
  selectedStatut: string = 'Tous';
  searchTerm: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  userId!: number;

  constructor(
    private evenementService: EvenementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    if (this.userId) {
      this.evenementService.getEvenementsCreesParUtilisateur(this.userId).subscribe({
        next: (data) => {
          this.evenements = data;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Erreur chargement événements créés', err);
          Swal.fire('Erreur', 'Impossible de charger vos événements.', 'error');
        }
      });
    }
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userId = Number(payload.id);
      }
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }

  applyFilters(): void {
    let filtres = this.evenements;

    if (this.selectedStatut !== 'Tous') {
      filtres = filtres.filter(e => e.statut === this.selectedStatut);
    }

    if (this.searchTerm.trim()) {
      const lowerTerm = this.searchTerm.toLowerCase();
      filtres = filtres.filter(e =>
        e.titre.toLowerCase().includes(lowerTerm) ||
        e.lieu.toLowerCase().includes(lowerTerm)
      );
    }

    this.evenementsFiltres = filtres;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.evenementsFiltres.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvenements = this.evenementsFiltres.slice(startIndex, endIndex);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onSupprimer(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Cet événement sera supprimé définitivement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.evenementService.supprimerEvenement(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Événement supprimé',
              text: 'Votre événement a été supprimé avec succès.',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
            this.evenements = this.evenements.filter(e => e.id !== id);
            this.applyFilters();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'La suppression a échoué. Veuillez réessayer.',
              confirmButtonText: 'Fermer'
            });
          }
        });
      }
    });
  }
  

  onModifier(evenement: Evenement): void {
    const dialogRef = this.dialog.open(EvenementModifierComponent, {
      width: '800px',
      data: evenement
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recharge la liste après modification
        this.evenementService.getEvenementsCreesParUtilisateur(this.userId).subscribe({
          next: (data) => {
            this.evenements = data;
            this.applyFilters();
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de rafraîchir les données après modification.', 'error');
          }
        });
      }
    });
  }
}
