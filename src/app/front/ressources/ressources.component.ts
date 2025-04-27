import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { CategorieService } from 'src/app/front/services/service-categories.service';
import { RessourceService } from 'src/app/front/services/ressource.service';
import { FullResources, Ressource } from 'src/classes-categorie/ressource';
import { AddCategorieComponent } from '../add-categorie/add-categorie.component';
import { AjoutRessourcesComponent } from '../ajout-ressources/ajout-ressources.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.css']
})
export class RessourcesComponent implements OnInit, OnDestroy {
  ressources: Ressource[] = [];
  filteredRessource: Ressource[] = [];
  pagedRessources: Ressource[] = [];
  idCategorie: number | null = null;
  idUser: number = 0;
  // Pagination settings
  pageSize = 1;
  pageSizeOptions: number[] = [12, 24, 48];
  currentPage = 0;
  totalItems = 0;
  private routerSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private rs: CategorieService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router, 
    private ressourceService: RessourceService,
  ) {
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadResources();
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['idCategorie'];
      this.idCategorie = isNaN(id) ? null : id;
      this.loadResources();
    });

    this.route.queryParams.subscribe(params => {
      if (params['refresh']) {
        this.loadResources(true);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  loadResources(forceRefresh: boolean = false): void {
    if (this.idCategorie === null) {
      console.error('ID catégorie est null');
      return;
    }

    this.rs.getAllResourcesbyIdCategorie(this.idCategorie).subscribe({
      next: (data: FullResources) => {
        this.ressources = data.ressources ?? [];
        this.filteredRessource = [...this.ressources];
        this.totalItems = this.filteredRessource.length;
        this.updatePagedRessources();
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedRessources();
  }

  private updatePagedRessources(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedRessources = this.filteredRessource.slice(startIndex, endIndex);
  }

  openModal(ressource?: Ressource): void {
    if (this.idCategorie === null) {
      console.error('ID catégorie est null');
      return;
    }

    const dialogRef = this.dialog.open(AjoutRessourcesComponent, {
      width: '600px',
      data: {
        ressource: ressource || null,
        idCategorie: this.idCategorie
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshAfterModalClose();
      }
    });
  }

  private refreshAfterModalClose(): void {
    if (this.idCategorie === null) return;

    this.rs.getAllResourcesbyIdCategorie(this.idCategorie).subscribe({
      next: (data: FullResources) => {
        this.ressources = data.ressources ?? [];
        this.filteredRessource = [...this.ressources];
        this.totalItems = this.filteredRessource.length;
        this.updatePagedRessources();
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des ressources:', error);
      }
    });
  }


previousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePagedRessources();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.updatePagedRessources();
  }
}

 

get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}

}