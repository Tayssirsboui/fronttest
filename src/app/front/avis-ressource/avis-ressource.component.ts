
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
  selector: 'app-avis-ressource',
  templateUrl: './avis-ressource.component.html',
  styleUrls: ['./avis-ressource.component.css'],
  
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

export class AvisRessourceComponent {
  
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
  
    ngOnInit(): void {
      this.idUser = this.decodeTokenPayload(this.token).id;
      this.role = this.decodeTokenPayload(this.token).role;
      this.showbutton = false;
      this.id = this.route.snapshot.params['id'];
      console.log(this.id);
      if (this.id !== null) {
      
        this.getComments();
     
      } else {
        this.showAlert('ID de ressource invalide', 'error');
      }
    }/*
    ngOnInit(): void {
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
    }*/
  
  



  
  
  
  
  
   
    
  

  
  
    private getRouteId(): number | null {
      const idParam = this.route.snapshot.paramMap.get('id');
      return idParam ? +idParam : null;
    }
  

   
    

  

  

  
   
  
    
  

 

  
    private showAlert(message: string, type: 'success'|'error'|'warning'): void {
      this.snackBar.open(message, 'Fermer', {
        duration: 5000,
        panelClass: [`snackbar-${type}`],
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }

  
  
  
  

  canEdit(): boolean {
    return this.moi() || this.role === 'admin';
  }
  moi(): boolean {
    return this.ressource?.idUser?.toString() === this.idUser?.toString();
    
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
