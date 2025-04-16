import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';
import { ProjetService } from 'src/app/services/projet.service';
import { AjouterProjetComponent } from '../ajouter-projet/ajouter-projet.component';  // Assure-toi que le chemin est correct
import { AjouterCollaborationComponent } from '../ajouter-collaboration/ajouter-collaboration.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css']
})
export class ProjetsComponent {
  
  projets: Projet[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: string[] = [];
  

  filterBy(category: string) {
    this.selectedCategory = category;
  }
  
  constructor(private projetService: ProjetService, private dialog: MatDialog,private router: Router) {}

  ngOnInit(): void {
    this.chargerProjets();  // Appel initial pour charger les projets
  }

  // Méthode pour charger les projets depuis le service
  chargerProjets(): void {
    this.projetService.getProjets().subscribe(data => {
      this.projets = data;
      this.categories = Array.from(new Set(data.map(p => p.categorie))).sort(); // 🟣 Catégories uniques triées
    });
  }
  // Cette méthode permet de récupérer le statut d'un projet en fonction de la date de fin
  getStatut(projet: Projet): string {
    const now = new Date();
    const dateFin = new Date(projet.dateFinPrevue);
    return now > dateFin ? 'Terminé' : 'En cours';
  }
  // Méthode pour déterminer la classe de badge en fonction du statut
  getBadgeClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'en cours': return 'badge badge-warning';
      case 'terminé': return 'badge badge-success';
      default: return 'badge bg-secondary text-white';
    }}

  // Méthode pour récupérer le nombre de collaborateurs actuels sur un projet
  getCollaborateursActuels(projet: Projet): number {
    return projet.collaborations?.length || 0;
  }

  // Méthode pour gérer l'action de collaborer sur un projet
  onCollaborer(projetId: number) {
    const dialogRef = this.dialog.open(AjouterCollaborationComponent, {
      width: '500px',
      data: { projetId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/collaborations']); // ou rechargement dynamique si besoin
      }
    });
  }
  
  // openAjouterProjet(): void {
  //   const dialogRef = this.dialog.open(AjouterProjetComponent, {
  //     width: '600px'
  //   });

  //   dialogRef.afterClosed().subscribe(projet => {
  //     if (projet) {
  //       projet.competencesRequises = projet.competencesRequises
  //         ? projet.competencesRequises.split(',').map((c: string) => c.trim())
  //         : [];
  //       this.projetService.addProjet(projet).subscribe(p => {
  //         this.projets.push(p);
  //       });
  //     }
  //   });
  // }
  openModal(projet?: Projet) {
    const dialogRef = this.dialog.open(AjouterProjetComponent, {
      width: '600px',
      data: projet || {}  // Si tu passes un projet, c'est une modif
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
      this.ngOnInit(); // Recharge les projets
    }
  });}


  supprimerProjet(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      this.projetService.deleteProjet(id).subscribe(() => {
        this.chargerProjets(); // recharge la liste après suppression
      });
    }
  }
  
}