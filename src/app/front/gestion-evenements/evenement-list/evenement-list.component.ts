import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Evenement } from 'src/app/models/evenement.model';
import { EvenementService } from 'src/app/services/evenement.service';
import { EvenementDetailComponent } from '../evenement-detail/evenement-detail.component';
import { ParticipationModalComponent } from '../participation-modal/participation-modal.component';
import { EvenementModifierComponent } from '../evenement-modifier/evenement-modifier.component';
import * as AOS from 'aos';

import { EvenementModalComponent } from '../evenement-modal/evenement-modal.component';
import { ParticipationService } from 'src/app/services/participation.service';
import { ListeAttenteModalComponent } from '../liste-attente-modal/liste-attente-modal.component';


import { MatDialog } from '@angular/material/dialog';
declare var bootstrap: any;

@Component({
  selector: 'app-evenement-list',
  templateUrl: './evenement-list.component.html',
  styleUrls: ['./evenement-list.component.css']
})
export class EvenementListComponent implements OnInit {
  evenements: Evenement[] = [];
  evenementsFiltres: Evenement[] = [];
  searchTerm: string = '';

  constructor(
    private evenementService: EvenementService,
    private modalService: NgbModal,//supprimer
    private router: Router,
    private participationService: ParticipationService,
    private dialog: MatDialog,
    
  ) {}

  ngOnInit(): void {
    this.evenementService.getAll().subscribe({
      next: data => {
        this.evenements = data;
        this.evenementsFiltres = data;
        AOS.init({ duration: 1000, once: true }); // ✅ initialise l'animation après chargement des données
           //  Active les tooltips Bootstrap
           const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
           tooltipTriggerList.forEach(tooltipTriggerEl => {
             new bootstrap.Tooltip(tooltipTriggerEl);
           });
      },
      error: err => console.error('Erreur de chargement', err)
    });
  }

  ouvrirDetail(e: Evenement) {
    this.dialog.open(EvenementDetailComponent, {
      data: e,
      width: '500px',
      autoFocus: false,
      panelClass: 'custom-dialog'
    });
  }

  // ouvrirParticipation(e: Evenement) {
  //   const modalRef = this.modalService.open(ParticipationModalComponent, { centered: true });
  //   modalRef.componentInstance.evenement = e;
  // }
  ouvrirParticipation(e: Evenement) {
    const dialogRef = this.dialog.open(ParticipationModalComponent, {
      width: '400px',
      data: e
    });
  
    dialogRef.afterClosed().subscribe((updatedEvent: Evenement) => {
      if (updatedEvent) {
        this.participationService.getEvenementById(updatedEvent.id).subscribe(freshEvent => {
          const index = this.evenements.findIndex(ev => ev.id === freshEvent.id);
          if (index !== -1) {
            this.evenements[index] = freshEvent;
            this.filtrerEvenements();
          }
        });
      }
    });
  }
  ouvrirListeAttenteModal(evenement: Evenement) {
    this.dialog.open(ListeAttenteModalComponent, {
      width: '400px',
      data: evenement
    });
  }
  

  modifierEvenement(e: Evenement) {
    const modalRef = this.modalService.open(EvenementModifierComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.data = e;

    modalRef.result.then(
      (result) => {
        if (result === true) this.ngOnInit();
      },
      () => {}
    );
  }

  supprimerEvenement(id: number): void {
    if (confirm('Confirmer la suppression ?')) {
      this.evenementService.delete(id).subscribe({
        next: () => {
          this.evenements = this.evenements.filter(e => e.id !== id);
          this.filtrerEvenements(); // refresh filtre
        },
        error: err => alert("Erreur lors de la suppression ❌")
      });
    }
  }

  trierParDate(order: string) {
    if (order === 'asc') {
      this.evenementsFiltres.sort((a, b) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime());
    } else if (order === 'desc') {
      this.evenementsFiltres.sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime());
    }
  }

  filtrerEvenements(): void {
    const normalized = this.normalize(this.searchTerm.trim().toLowerCase());

    this.evenementsFiltres = this.evenements.filter(e => {
      const titreNorm = this.normalize(e.titre.toLowerCase());
      const lieuNorm = this.normalize(e.lieu.toLowerCase());
      return titreNorm.startsWith(normalized) || lieuNorm.startsWith(normalized);
    });
  }

  normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  ouvrirAjoutEvenement() {
    const dialogRef = this.dialog.open(EvenementModalComponent, {
      width: '700px',
      disableClose: true,
      autoFocus: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
  // Pagination
  currentPage = 1;
  itemsPerPage = 4;
  
  get paginatedEvenements(): Evenement[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.evenementsFiltres.slice(start, start + this.itemsPerPage);
  }
  
  get totalPages(): number[] {
    return Array(Math.ceil(this.evenementsFiltres.length / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
  }
  
  changerPage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }
  



  
}
