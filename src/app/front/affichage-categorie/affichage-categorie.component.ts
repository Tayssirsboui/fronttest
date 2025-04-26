import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CategorieService } from 'src/app/front/services/service-categories.service';
import { Categorie } from 'src/classes-categorie/Categorie';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddCategorieComponent } from '../add-categorie/add-categorie.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-affichage-categorie',
  templateUrl: './affichage-categorie.component.html',
  styleUrls: ['./affichage-categorie.component.css']
})
export class AffichageCategorieComponent {

  constructor(private http: HttpClient,
    private modalService: NgbModal,

    private snackBar: MatSnackBar,
     private rs: CategorieService,
     private router: Router,
     private dialog: MatDialog,
     private cdRef: ChangeDetectorRef) {}


  categories: Categorie[] = [];

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  
  private showError(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 8000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  openModal(categorie?: Categorie) {
   
    const dialogRef = this.dialog.open(AddCategorieComponent, {
      width: '600px',
      data: categorie || {}  // Si tu passes une catgorie, c'est une modif
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rs. getcategorie().subscribe(data => {
          this.categories = data;
          this.cdRef.detectChanges(); 
          this.ngOnInit();
       // S'assure que la carte reste fermée après la modification
       this.activeCardId = null;
        });
      }else {
        // Même si l'utilisateur annule, on ferme la carte
        this.activeCardId = null;
      }
    });
  
}




previousPage() {
  if (this.currentPage > 0) {
    this.currentPage--;
    this.updatePagedCategories();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages - 1) {
    this.currentPage++;
    this.updatePagedCategories();
  }
}



updatePagedCategories(): void {
  const startIndex = this.currentPage * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedCategories = this.filteredCategories.slice(startIndex, endIndex);
  // Supprimer les classes d'animation précédentes pour éviter les conflits
  document.querySelectorAll('[id^="category-"]').forEach(el => {
    el.classList.remove('show', 'hide');
  });

  // Appliquer une animation d'apparition après un petit délai
  setTimeout(() => {
    this.pagedCategories.forEach(categorie => {
      const element = document.getElementById(`category-${categorie.idCategorie}`);
      if (element) {
        element.classList.remove('hide');
        element.classList.add('show');
      }
    });
  }, 50);
}


onPageChange(event: PageEvent): void {
  this.currentPage = event.pageIndex;
  this.pageSize = event.pageSize;
  this.updatePagedCategories();
}



get totalPages(): number {
  return Math.ceil(this.totalItems / this.pageSize);
}


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  pagedCategories: Categorie[] = []; // Catégories paginées
  currentPage: number = 0;
  pageSize: number = 6; // 6 éléments par page
  totalItems: number = 0;
  categoriees: Categorie[] = []; // Liste des catégories
  filteredCategories: Categorie[] = []; // Liste des catégories filtrées
  selectedFilter: string = '*'; // Filtre par défaut (toutes les catégories)
  listcategorie!: Categorie[]; // Liste des catégories pour d'autres opérations

  isPressing = false;      // Si l'utilisateur appuie sur le bouton
  isConfirmed = false;     // Si la suppression est confirmée
  pressTimeout: any;       // Délai de maintien
  isLoading: boolean = false; // Etat de chargement pour la suppression
  activeCardId: number | null = null;
  // Propriété pour suivre l'ID de la catégorie sélectionnée
  selectedCategoryId: number | null = null;

  // Cette fonction est appelée lorsque l'utilisateur commence à appuyer sur le bouton
  startPress(categorieId: number) {
    this.selectedCategoryId = categorieId; // Stocke l'ID de la catégorie sélectionnée
    this.isPressing = true;
    this.isConfirmed = false;

    // Démarre un délai de 2 secondes pour valider la suppression
    this.pressTimeout = setTimeout(() => {
      this.isConfirmed = true;  // Confirmer la suppression après 2 secondes
      console.log('Suppression confirmée');
      // Appelez la méthode pour effectuer la suppression ici
      if (this.selectedCategoryId !== null) {
        this.deleteCategorie(this.selectedCategoryId); // Passe l'ID de la catégorie à supprimer
      }
    }, 2455);  // 2 secondes de maintien pour valider la suppression
  }

  // Cette fonction est appelée lorsque l'utilisateur relâche l'appui avant 2 secondes
  endPress() {
    if (!this.isConfirmed) {
      clearTimeout(this.pressTimeout);  // Annule le délai si l'utilisateur relâche avant 2 secondes
      this.isPressing = false;
    }
  }

  // Cette fonction est appelée si l'utilisateur déplace la souris ou annule l'appui
  cancelPress() {
    clearTimeout(this.pressTimeout);  // Annule le délai si l'utilisateur quitte le bouton
    this.isPressing = false;
  }




  toggleCard(categorieId: number): void {
    // Si la carte est déjà active, la masquer, sinon l'afficher
    this.activeCardId = this.activeCardId === categorieId ? null : categorieId;
  }
  editCategory(categorie: any): void {
    // Redirige vers le formulaire d'édition avec les données de la catégorie
    this.router.navigate(['/edit-category'], { queryParams: { id: categorie.idCategorie } });
  }
 
  ngOnInit(): void {
    this.rs.getcategorie().subscribe(
      (data) => {
        this.categories = data;
         // Toutes les catégories récupérées
        this.filteredCategories = data; // Initialiser les catégories filtrées avec toutes les catégories
        this.categoriees = data; // Initialiser la liste des catégories
        this.totalItems = this.filteredCategories.length;
        this.updatePagedCategories();
         console.log('Catégories récupérées :', this.categories);
        // Appliquer la classe "show" à toutes les catégories pour l'animation initiale
        setTimeout(() => {
          this.filteredCategories.forEach((categorie) => {
            const element = document.getElementById(`category-${categorie.idCategorie}`);
            if (element) {
              element.classList.add('show');
            }
          });
        }, 50)                                
      },
      (error) => {
        console.error('Erreur lors de la récupération des catégories :', error);
                 console.log('favorite', this.favoris);

      }
    );
    this.rs.getFavoris(this.idUser).subscribe(favs => {
      this.favoris = favs;
      console.log('favorite', this.favoris);});

 

  }
 /* // Méthode pour récupérer les domaines uniques
  getUniqueDomaines(): string[] {
    const uniqueDomaines = new Set(this.categories.map((categorie) => categorie.domaine));
    return Array.from(uniqueDomaines);
  }*/
  getUniqueCategoryNames(): string[] {
    const uniqueNames = new Set(this.categories.map((categorie) => categorie.nomCategorie));
    return Array.from(uniqueNames);
  }

// Méthode pour supprimer une catégorie - Version corrigée
deleteCategorie(categorieId: number): void {
  console.log('Suppression en cours pour la catégorie ID:', categorieId);
  if (this.isPressing && this.isConfirmed) {  
      this.isLoading = true;  
      this.rs.deletecategorie(categorieId).subscribe({
          next: () => {
              console.log(`Catégorie avec ID ${categorieId} supprimée avec succès.`);
              
              // 1. Mettre à jour les listes locales
              this.categories = this.categories.filter(c => c.idCategorie !== categorieId);
              this.filteredCategories = this.filteredCategories.filter(c => c.idCategorie !== categorieId);
              
              // 2. Mettre à jour les compteurs et la pagination
              this.totalItems = this.filteredCategories.length;
              
              // 3. Vérifier si on doit revenir à la page précédente
              if (this.pagedCategories.length === 1 && this.currentPage > 0) {
                  this.currentPage--;
              }
              
              // 4. Mettre à jour l'affichage paginé
              this.updatePagedCategories();
              
              // 5. Réinitialiser les états
              this.isLoading = false;
              this.isPressing = false;
              this.isConfirmed = false;
              
              // 6. Rafraîchir l'affichage
              this.cdRef.detectChanges();
              this.showSuccess('Catégorie supprimée avec succès.');
              
          },
          error: (error) => {
              console.error(`Erreur lors de la suppression:`, error);
              this.isLoading = false;
              this.isPressing = false;
              this.isConfirmed = false;
              this.showError(error.error?.message || 'Erreur lors de la mise à jour');

             
          }
      });
  } else {
      console.log('Suppression non confirmée');
      this.isPressing = false;
      this.isConfirmed = false;
     
  }
}
  

  // Méthode pour incrémenter les likes
  likee(index: number): void {
    if (this.listcategorie[index]) {
      this.listcategorie[index].likes = (this.listcategorie[index].likes || 0) + 1;
    }
  }

  // Méthode pour filtrer les catégories
  getUniqueDomaines(): string[] {
    const uniqueDomaines = new Set(
      this.categories.map((categorie) => categorie.domaine.trim().toLowerCase())
    );
    return Array.from(uniqueDomaines).map(domaine => this.capitalizeFirstLetter(domaine));
  }
  
  // Méthode pour mettre la première lettre en majuscule et le reste en minuscule
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  incrementLike(categorie: any): void {
    console.log('Catégorie reçue dans incrementLike :', categorie);

    // Vérifiez si l'ID de la catégorie est présent
    if (!categorie.idCategorie) {
      console.error('ID de la catégorie manquant !');
      alert('Impossible de mettre à jour les likes : ID de la catégorie manquant.');
      return;
    }

    // Incrémenter localement
    categorie.likes = (categorie.likes || 0) + 1;

    // Envoyer la nouvelle valeur au backend
    this.rs.updateCategorieLikes(categorie.idCategorie, categorie.likes).subscribe({
      next: (response) => {
        console.log(`Likes mis à jour pour la catégorie ${categorie.nomCategorie} :`, response);
      },
      error: (error) => {
        console.error(`Erreur lors de la mise à jour des likes pour la catégorie ${categorie.nomCategorie} :`, error);
        this.showError(error.error?.message || 'Erreur lors de la mise à jour des likes. Veuillez réessayer.');

        alert('Erreur lors de la mise à jour des likes. Veuillez réessayer.');
      }
    });
  }
  /*setFilter(filter: string): void {
    this.selectedFilter = filter;
    if (filter === '*') {
      this.filteredCategories = this.categories; // Afficher toutes les catégories
    } else {
      this.filteredCategories = this.categories.filter(
        (categorie) => this.capitalizeFirstLetter(categorie.domaine) === filter
      );
    }
    
    // Appliquer une classe "hide" à toutes les catégories avant de filtrer
    this.filteredCategories.forEach((categorie) => {
      const element = document.getElementById(`category-${categorie.idCategorie}`);
      if (element) {
        element.classList.remove('show');
        element.classList.add('hide');
      }
    });
  
    // Attendre la fin de l'animation avant de mettre à jour les catégories affichées
    setTimeout(() => {
      if (filter === '*') {
        this.filteredCategories = this.categories; // Afficher toutes les catégories
      } else {
        this.filteredCategories = this.categories.filter(
          (categorie) => this.capitalizeFirstLetter(categorie.domaine) === filter
        );
      }
  
      // Appliquer une classe "show" aux nouvelles catégories affichées
      setTimeout(() => {
        this.filteredCategories.forEach((categorie) => {
          const element = document.getElementById(`category-${categorie.idCategorie}`);
          if (element) {
            element.classList.remove('hide');
            element.classList.add('show');
          }
        });
      }, 50); // Délai pour appliquer la classe "show"
    }, 500); // Durée de l'animation CSS
  }
  */
  setFilter(filter: string): void {
    // Masquer les éléments existants avec une animation CSS
    document.querySelectorAll('[id^="category-"]').forEach(el => {
      el.classList.remove('show');
      el.classList.add('hide');
    });
  
    // Stocker temporairement la liste filtrée
    let updatedFiltered: Categorie[] = [];
  
    if (filter === 'favorites') {
      this.selectedFilter = 'favorites';
      updatedFiltered = this.categories.filter(categorie =>
        this.favoris.some(fav => fav.idCategorie === categorie.idCategorie)
      );
    } else if (filter === '*') {
      this.selectedFilter = '*';
      updatedFiltered = [...this.categories];
    } else {
      this.selectedFilter = filter;
      updatedFiltered = this.categories.filter(categorie =>
        this.capitalizeFirstLetter(categorie.domaine) === filter
      );
    }
  
    // Attendre la fin de l'animation avant de mettre à jour la liste affichée
    setTimeout(() => {
      this.filteredCategories = updatedFiltered;
      this.totalItems = this.filteredCategories.length;
      this.currentPage = 0;
      this.updatePagedCategories(); // Mise à jour de la pagination
  
      // Appliquer l’animation d’apparition sur les éléments paginés uniquement
      setTimeout(() => {
        this.pagedCategories.forEach(categorie => {
          const element = document.getElementById(`category-${categorie.idCategorie}`);
          if (element) {
            element.classList.remove('hide');
            element.classList.add('show');
          }
        });
      }, 50);
    }, 500);
  }
  

closeCard(): void {
  this.activeCardId = null;
}







//liste favorite 
//const userId = this.authService.getUserId();//a ajouter pour recuperer
idUser: number = 1; // ID de l'utilisateur (à adapter selon votre logique)
isFavorite = false;
favoris: Categorie[] = [];

// Vérifie si une catégorie est favorite
checkIfFavorite(categorieId: number): boolean {

  return this.favoris.some(fav => fav.idCategorie === categorieId);
}

// Ajoute ou retire un favori
toggleFavorite(categorie: Categorie): void {
  const isFav = this.checkIfFavorite(categorie.idCategorie);

  if (isFav) {
    this.rs.retirerFavori(this.idUser, categorie.idCategorie).subscribe(() => {
      this.favoris = this.favoris.filter(fav => fav.idCategorie !== categorie.idCategorie);
      this.showSuccess(`Favori retiré : ${categorie.nomCategorie}`);
      this.rs.getFavoris(this.idUser).subscribe(favs => {
        this.favoris = favs;
        console.log('favorite', this.favoris);});
    });
  } else {
    this.rs.ajouterFavori(this.idUser, categorie.idCategorie).subscribe(() => {
      this.favoris.push(categorie);
      this.showSuccess(`Ajouté aux favoris : ${categorie.nomCategorie}`);
      this.rs.getFavoris(this.idUser).subscribe(favs => {
        this.favoris = favs;
        console.log('favorite', this.favoris);});
    });
  }
}
// affichage fav
showOnlyFavorites: boolean = false; // Nouvelle propriété pour le mode favoris

 // Méthode pour basculer entre tous les éléments et les favoris
 toggleFavoritesView(): void {
  this.showOnlyFavorites = true;
  this.filteredCategories = []; // Réinitialiser les catégories filtrées
  this.currentPage = 0; // Réinitialiser la pagination
  this.rs.getFavoris(this.idUser).subscribe(favs => {
    this.favoris = favs;});
  if (this.showOnlyFavorites) {
    // Filtrer pour n'afficher que les favoris
    this.filteredCategories = this.categoriees.filter(categoriee => 
      this.favoris.some(fav => fav.idCategorie === categoriee.idCategorie)
    );
  } else {
    // Afficher toutes les catégories
    this.filteredCategories = this.categories;
  }

  this.totalItems = this.filteredCategories.length;
  this.updatePagedCategories();
  this.cdRef.detectChanges();
}



}
