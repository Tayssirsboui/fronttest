import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { RessourceService } from '../services/ressource.service';
import { Ressource } from 'src/classes-categorie/ressource';
import { AjoutRessourcesComponent } from '../ajout-ressources/ajout-ressources.component';

import { saveAs } from 'file-saver';
import { loadStripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { TokenService } from 'src/app/services/token/token.service';
//import { environment } from 'src/environments/environment';
declare var paypal: any;
@Component({
  selector: 'app-detail-ressource',
  templateUrl: './detail-ressource.component.html',
  styleUrls: ['./detail-ressource.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DetailRessourceComponent  implements OnInit{
  @ViewChild('paypalButton', { static: true }) paypalButton!: ElementRef;
  ressource: any = null;
  currentPdfIndex = 0;
  isDeleting = false;
  id: number | null = null;
  idCategorie: number | null = null; // Initialisé à null
  ressources: Ressource[] = [];
  paiementEnCours = false;
  idUser :number =0;
  showbutton = false;
  errorMessage = '';
  afficherBoutonPaypal = false;
  showPaymentModal = false;
  isAdmin = false;
  imageSize: string | null = null;   // Taille de l'image
  hasPurchased = false
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ressourceService: RessourceService,
    private dialog: MatDialog,
   private tk:TokenService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
  ) {}

  role: string = ''; 
/*
  ngOnInit(): void {
    this.idUser = this.decodeTokenPayload(this.token).id;
    this.role = this.decodeTokenPayload(this.token).role;
    this.showbutton = false;
    this.id = this.getRouteId();
    
    if (this.id !== null) {
      this.loadRessource(this.id);
      this.getComments();
      this.loadRessourcesAchetees();
    } else {
      this.showAlert('ID de ressource invalide', 'error');
    }
  }*/
  ngOnInit(): void {
   console.log (this.id)
    this.idUser=this.decodeTokenPayload(this.token).id;
    this.role=this.decodeTokenPayload(this.token).role;
    this.showbutton = false;
    this.id = this.getRouteId();
    if (this.id !== null) {
      this.getComments();
      console.log('commentaies', this.comments);
      this.loadRessource(this.id);
    } else {
      this.showAlert('ID de ressource invalide', 'error');
    }
  
    this.loadRessourcesAchetees();
    console.log('achter', this.ressourcesAchetees);
    const filePath = this.ressource.fichiers[0].filePath;
    console.log("📁 Chemin du fichier PDF :", filePath); 
  }


  shouldDisplayImage(): boolean {
    return !!this.ressource?.imageBase64 && this.ressource.type !== 'PDF';
  }
  
  getSafeImageUrl(): string {
    // Vérifie que le base64 est valide avant de créer l'URL
    if (this.ressource?.imageBase64?.startsWith('/9j/') || 
        this.ressource?.imageBase64?.startsWith('iVBOR')) {
      return `data:image/jpeg;base64,${this.ressource.imageBase64}`;
    }
    return 'assets/images/fallback-image.jpg'; // Image de remplacement
  }
  loadRessource(id: number): void {
    this.ressourceService.getRessourceById(id).subscribe({
      next: (data) => {
        this.ressource = data;
        this.currentPdfIndex = 0;
        this.idCategorie = data.idCategorie ;
        console.log('Contenu texte:', this.ressource.text);
        console.log('ID Catégorie trouvé:', this.idCategorie);
        console.log('Détails de la ressource:', data);
        if (this.ressource.statut === 'Payant') {
          /*this.loadPaypalScript();*/
        }
      },
      
      error: (err) => {
        this.handleLoadError(err);
      }
    });
  }





 
  

  openModal(ressource?: Ressource, idCategorie?: number): void {
    const targetIdCategorie = idCategorie ?? this.idCategorie;
    
    if (targetIdCategorie === null) {
      this.showAlert('ID catégorie manquant', 'error');
      return;
    }

    const dialogRef = this.dialog.open(AjoutRessourcesComponent, {
      width: '800px',
      data: {
        ressource: ressource || null,
        idCategorie: targetIdCategorie,
        idRessource: ressource?.idRessource
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success && result.idRessource) {
        this.loadRessourceDetails(result.idRessource);
      }
    });
  }


  private getRouteId(): number | null {
    const idParam = this.route.snapshot.paramMap.get('id');
    return idParam ? +idParam : null;
  }

  // Les méthodes suivantes restent EXACTEMENT les mêmes que dans votre code original
  // pour garantir que le traitement des images et filePath ne change pas
  getImageUrl(filePath: string): string {
    const fileName = this.extractFileName(filePath);
    return `http://localhost:5010/uploads/${encodeURIComponent(fileName)}`;
  }  
  getPdfUrl(filePath: string): string {
    const fileName = this.extractFileName(filePath);
    return `http://localhost:5010/uploads/${encodeURIComponent(fileName)}`;
  }
 
  
  isImageFile(filename: string): boolean {
    if (!filename) return false;
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const lowerCaseFile = filename.toLowerCase();
    
    return imageExtensions.some(ext => lowerCaseFile.endsWith(ext));
  }
  extractFileName(path: string): string {
    return path.split(/[\\/]/).pop() || '';
  }

  previousPdf(): void {
    if (this.currentPdfIndex > 0) {
      this.currentPdfIndex--;
    }
  }

  nextPdf(): void {
    if (this.ressource?.fichiers && this.currentPdfIndex < this.ressource.fichiers.length - 1) {
      this.currentPdfIndex++;
    }
  }

  onPdfError(event: any): void {
    console.error('Erreur PDF:', event);
    this.showAlert('Erreur de chargement du PDF', 'error');
  }

 

  confirmSuppression(): void {
    if (!this.id) {
      this.showAlert('ID de ressource manquant', 'error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmer la suppression',
        message: 'Cette action est irréversible. Continuer?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });
    this.idCategorie = this.ressource.idCategorie;
    console.log('ID Catégorie supp conf:', this.idCategorie);
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.supprimer();
      }
    });
  }

  supprimer(): void {
    this.idCategorie = this.ressource.idCategorie;
    console.log('ID Catégorie supp:', this.idCategorie);
    if (!this.id) {
      this.showAlert('ID de ressource manquant', 'error');
      return;
    }

    this.isDeleting = true;
    
    this.ressourceService.deleteRessource(this.id).subscribe({
      next: () => {
        this.handleDeleteSuccess();
      },
   
      
    });
  }

  private handleDeleteSuccess(): void {
    this.showAlert('Suppression réussie', 'success');
    this.idCategorie = this.ressource.idCategorie;
    console.log('ID Catégorie supp handell:', this.idCategorie);
    if (this.idCategorie) {
      // Redirection vers la liste des ressources DE LA CATÉGORIE
      this.router.navigate(['/ressource', this.idCategorie], {
        queryParams: { refresh: Date.now() }});
      
      const navigationTarget = this.idCategorie 
      ? ['/ressource', this.idCategorie]
      : ['/ressources'];
  
    this.router.navigate(navigationTarget, {
      queryParams: { refresh: Date.now() },
      replaceUrl: true // Empêche le retour à la page supprimée via le bouton "back"
    });
  }}

  private handleLoadError(err: any): void {
    console.error('Erreur de chargement:', err);
    let message = 'Erreur lors du chargement';
    if (this.idCategorie) {
      // Redirection vers la liste des ressources DE LA CATÉGORIE
      this.router.navigate(['/ressource', this.idCategorie], {
        queryParams: { refresh: Date.now() }
      });}
  
    
    this.showAlert(message, 'error');
  }

  private showAlert(message: string, type: 'success'|'error'|'warning'): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  private loadRessourceDetails(id: number): void {
    this.ressourceService.getRessourceById(id).subscribe({
      next: (data) => {
        this.ressource = data;
        console.log('Détails de la ressource:', data);
      },
      error: (err) => console.error('Erreur chargement:', err)
    });
  }





//stripe

stripePromise = loadStripe('pk_test_51REAtZ4PwggyvyVQUYxoFh9yFqLgNSSepCnB1R8yolCS4xCPlRw81H3CyEduASNOwFq50WXGs4NCARVJzfaIGvYT00VZMjkDwi')

ressourcesAchetees: Ressource[] = []
async pay(resourceName: string, amount: number , ressourceId: number) {
  const stripe = await this.stripePromise;
  const userId = this.idUser; // à remplacer plus tard par un vrai système d'authentification

  this.http.post<any>('http://localhost:5010/api/payment/create-checkout-session', {
    ressourceId: this.id,
    utilisateurId: this.idUser,
    
    resourceName: resourceName,
    amount: amount * 100, // conversion en centimes
    successUrl: `http://localhost:4200/#/detail-ressource/${this.id}`,
    cancelUrl: 'http://localhost:4200/cancel'
  }).subscribe(async (response) => {
    const result = await stripe?.redirectToCheckout({
      sessionId: response.sessionId
    });
    if (result?.error) {
      alert(result.error.message);
    }
  });
}
canEdit(): boolean {
  return this.moi() || this.role === 'admin';
}
moi(): boolean {
  return this.ressource?.idUser?.toString() === this.idUser?.toString();
  
}
hasAccess(): boolean {
  // Si la ressource est gratuite, accès autorisé
  if (this.ressource?.statut === 'Gratuit') return true;
  if (this.ressource?.idUser === this.idUser) {
    return true;
  }
  // Vérifie si la ressource est dans la liste des ressources achetées de l'utilisateur
  return this.ressourcesAchetees?.some(r => r.idRessource === this.ressource?.id);

}
loadRessourcesAchetees() {
  const userId =  this.idUser; // à remplacer plus tard par un vrai système d'authentification
  this.http.get<Ressource[]>(`http://localhost:5010/api/payment/user/${userId}/ressources`)
    .subscribe(data => {
      this.ressourcesAchetees = data;
    });
}

//partie IA
// details-ressource.component.ts
mindmapUrl: string | null = null;
isGenerating: boolean = false; 
generateMindmap() {
 // const filePath = this.ressource.fichiers[0].filePath;
 const filePath = this.ressource.fichiers[0].filePath.replace(/\\/g, "/");
 this.isGenerating = true; 
 this.showbutton = true;
  console.log("📁 Chemin du fichier PDF :", filePath); // ← Affiche le chemin dans la console

  this.ressourceService.generateMindmap(filePath).subscribe(blob => {
    const url = URL.createObjectURL(blob);
    this.mindmapUrl = url;
    this.isGenerating = false; 
    this.calculateImageSize();
  }, err => {
    console.error("Erreur lors de la génération de la mindmap", err);
  });
}
downloadMindmap(): void {
  this.http.get('http://localhost:5010/api/mindmap/download', { responseType: 'blob' }).subscribe(
    (response) => {
      // Utilisation de FileSaver.js pour télécharger le fichier
      saveAs(response, 'mindmap.png');
    },
    (error) => {
      console.error('Erreur lors du téléchargement du fichier:', error);
    }
  );
}



calculateImageSize() {
  if (this.mindmapUrl) {
    // Utiliser fetch pour récupérer l'image et obtenir sa taille
    fetch(this.mindmapUrl)
      .then(response => response.blob())  // Convertir la réponse en un Blob
      .then(blob => {
        // Calculer la taille en Mo (1 Mo = 1024 * 1024 octets)
        const sizeInMo = (blob.size / (1024 * 1024)).toFixed(2);  // Arrondi à 2 décimales
        this.imageSize = `${sizeInMo} Mo`;  // Assigner la taille à imageSize
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'image:', error);
      });
  }
}


//rating 
rating = 0; // Note actuelle
stars = Array(5).fill(0); // 5 étoiles
comment = ''; // Commentaire
// L'ID de la ressource (à changer dynamiquement si besoin)



rate(index: number) {
  this.rating = index;
}
  // Méthodes utilitaires
  private resetForm(): void {
    this.rating = 0;
    this.comment = '';
  }
  isSubmitting = false;
submitRating() {
  if (this.rating === 0) return;
  this.isSubmitting = true;
  const payload = {
    resourceId: this.id,
    username: this.decodeTokenPayload(this.token).fullName, // À remplacer par le nom d'utilisateur réel
    userId:  this.idUser, // À remplacer si tu veux récupérer depuis l'utilisateur connecté
    rating: this.rating,
    comment: this.comment
  };

  this.newComment = {

    resourceId: this.id,
    username: this.decodeTokenPayload(this.token).fullName, // À remplacer par le nom d'utilisateur réel
    userId:  this.idUser, // À remplacer si tu veux récupérer depuis l'utilisateur connecté
    rating: this.rating,
    comment: this.comment

  }
  this.http.post('http://localhost:5010/api/ratings', payload).subscribe(() => {
    
    this.newComment = {

      resourceId: this.id,
      username: this.decodeTokenPayload(this.token).fullName, // À remplacer par le nom d'utilisateur réel
      userId:  this.idUser, // À remplacer si tu veux récupérer depuis l'utilisateur connecté
      rating: this.rating,
      comment: this.comment
  
    }
    // Reset après envoi si tu veux :
    this.rating = 0;
    this.comment = '';
    this.getComments();
  });
  this.resetForm;
  this.showAlert('Merci pour votre avis !', 'success');
  this.comments.unshift(this.newComment);
  this.ngOnInit;
  
}
//commentaires
newComment: any = null;
comments: any[] = [];

// Vérifier que l'ID n'est pas null dans getComments()
getComments() {
  if (this.id === null) {
    console.error('ID de ressource est invalide');
    return; // Ne pas faire la requête si l'ID est invalide
  }

  this.http.get<any[]>(`http://localhost:5010/api/ratings/comments/${this.id}`).subscribe({
    next: (data) => {
      this.comments = data;
      console.log('Commentaires:', this.comments);
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des commentaires:', err);
      this.showAlert('Erreur lors du chargement des commentaires', 'error');
    }
  });
}


//user 

token= localStorage.getItem('token') as string;
private decodeTokenPayload(token: string): any {
  try {
    const payload = token.split('.')[1]; // prendre la partie payload du JWT
    const decodedPayload = atob(payload); // décoder base64
    return JSON.parse(decodedPayload); // convertir en objet JSON
  } catch (error) {
    console.error('Failed to decode token payload', error);
    return null;
  }
}


}