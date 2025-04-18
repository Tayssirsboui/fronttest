import { Component, OnInit } from '@angular/core';
import { Collaboration } from 'src/app/models/collaboration';
import { CollaborationService } from 'src/app/services/collaboration.service';
import { MatDialog } from '@angular/material/dialog';
import { AjouterCollaborationComponent } from '../ajouter-collaboration/ajouter-collaboration.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(
    private collaborationService: CollaborationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {}

  ngOnInit(): void {
    this.loadCollaborations();
  }

  loadCollaborations(): void {
    this.collaborationService.getCollaborations().subscribe(data => {
      this.collaborations = data;
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
    if (confirm("Êtes-vous sûr de vouloir annuler cette collaboration ?")) {
      this.collaborationService.deleteCollaboration(collabId).subscribe(() => {
        this.loadCollaborations();
      });
    }
  }

  onModifier(collab: Collaboration): void {
    const dialogRef = this.dialog.open(AjouterCollaborationComponent, {
      width: '500px',
      data: collab
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCollaborations();
      }
    });
  }
  onAccepter(collabId: number): void {
    this.collaborationService.accepterCollaboration(collabId).subscribe(() => {
      this.loadCollaborations();
      this.snackBar.open('Collaboration acceptée !', 'Fermer', {
        duration: 3000,
        verticalPosition: 'top',   // au lieu de bottom
        horizontalPosition: 'center',
        panelClass: ['success-snackbar']
      });
      
    });
  }
  
  
}
