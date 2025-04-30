import { Component, OnInit } from '@angular/core';
import { Collaboration } from 'src/app/models/collaboration';
import { CollaborationService } from 'src/app/services/collaboration.service';
import { MatDialog } from '@angular/material/dialog';
import { AjouterCollaborationComponent } from '../ajouter-collaboration/ajouter-collaboration.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoadmapModalComponent } from '../roadmap-modal/roadmap-modal.component';
import { ProjetService } from 'src/app/services/projet.service';
import { AuthentificationService } from 'src/app/services/services';
import { Projet } from 'src/app/models/projet';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-collaborations',
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.css']
})
export class CollaborationsComponent implements OnInit {
  collaborations: Collaboration[] = [];
  filteredCollaborations: Collaboration[] = [];
  paginatedCollaborations: Collaboration[] = [];

  searchTerm: string = '';
  selectedStatut: string = 'Tous';
  statuts: string[] = ['Tous', 'Accepté', 'Refusé', 'Non traité'];

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  userId!: number;
  userRole!: string;

  constructor(
    private collaborationService: CollaborationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private projetService: ProjetService,
    private authService: AuthentificationService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.authService.decodeToken(token);
      this.userId = decoded?.id;
      this.userRole = decoded?.role;
    }
    this.loadCollaborations();
  }

  loadCollaborations(): void {
    this.collaborationService.getCollaborations().subscribe(async (data) => {
      const validCollaborations: Collaboration[] = [];

      for (const collab of data) {
        try {
          const projet = await this.projetService.getProjetById(collab.projetId).toPromise();
          if (projet) {
            collab.projet = projet as Projet;
      
            if (
              (this.userRole === 'Student' && collab.userId === this.userId) ||
              (this.userRole === 'Entrepreneur' && projet.userId === this.userId)
            ) {
              validCollaborations.push(collab);
            }
          }
        } catch (err) {
          console.error("❌ Erreur lors du chargement du projet pour collaboration ID", collab.id, err);
        }
      }
      
      this.collaborations = validCollaborations;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredCollaborations = this.collaborations.filter(collab => {
      const matchesSearch = this.searchTerm
        ? collab.role.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesStatut = this.selectedStatut === 'Tous' || collab.statut === this.selectedStatut;

      return matchesSearch && matchesStatut;
    });

    this.totalPages = Math.ceil(this.filteredCollaborations.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedCollaborations = this.filteredCollaborations.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  onAnnuler(collabId: number): void {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, annuler !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.collaborationService.deleteCollaboration(collabId).subscribe(() => {
          this.loadCollaborations();
          Swal.fire({
            title: "Annulée !",
            text: "La collaboration a été annulée.",
            icon: "success"
          });
        });
      }
    });
  }
  

  onModifier(collab: Collaboration): void {
    const dialogRef = this.dialog.open(AjouterCollaborationComponent, {
      width: '500px',
      data: collab
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCollaborations();
        Swal.fire({
          icon: 'success',
          title: 'Modifiée !',
          text: 'La collaboration a été mise à jour avec succès.',
          confirmButtonColor: "#3085d6"
        });
      }
    });
  }
  

  onAccepter(collabId: number): void {
    this.collaborationService.accepterCollaboration(collabId).subscribe(() => {
      this.loadCollaborations();
      Swal.fire({
        icon: 'success',
        title: 'Acceptée !',
        text: 'La collaboration a été acceptée.',
        confirmButtonColor: "#3085d6"
      });
    });
  }
  

  openRoadmapModal(collab: Collaboration): void {
    if (!collab.projetId) {
      console.error("Aucun projetId trouvé dans la collaboration.");
      return;
    }

    this.projetService.getProjetById(collab.projetId).subscribe({
      next: (projet) => {
        collab.projet = projet;
        this.dialog.open(RoadmapModalComponent, {
          width: '700px',
          data: collab
        });
      },
      error: (err) => {
        console.error("Erreur lors du chargement du projet:", err);
      }
    });
  }
}
