// Importation des modules nécessaires depuis Angular et autres dépendances
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from 'src/classes-categorie/Categorie';
import { CategorieService } from 'src/app/front/services/service-categories.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from 'src/app/services/token/token.service';
@Component({
  selector: 'app-add-categorie', // Sélecteur du composant (utilisé dans le HTML)
  templateUrl: './add-categorie.component.html', // Chemin du fichier HTML associé
  styleUrls: ['./add-categorie.component.css'] // Chemin du fichier CSS associé
})
export class AddCategorieComponent implements OnInit {
  form!: FormGroup; // Déclaration du formulaire réactif
  imagePreview: string | ArrayBuffer | null = null; // Variable pour l'aperçu de l’image sélectionnée
  message: string = ''; // Message d’erreur ou de confirmation
  isEditMode: boolean = false; // Indique si le composant est utilisé pour modifier une catégorie
  idUser: number = 0; // ID de l'utilisateur (non utilisé dans le code actuel)
  // Injection des dépendances nécessaires via le constructeur
  constructor(private tk:TokenService,
    private fb: FormBuilder, // FormBuilder pour créer le formulaire réactif
    private categorieService: CategorieService, // Service pour gérer les catégories (ajout, modification)
    private dialogRef: MatDialogRef<AddCategorieComponent>, 
    private snackBar: MatSnackBar,// Référence à la boîte de dialogue (Material)
    @Inject(MAT_DIALOG_DATA) public data: Categorie | null // Données injectées dans le dialogue (mode édition)
  ) {}
  token= localStorage.getItem('token') as string;
  // Méthode appelée à l’initialisation du composant
  ngOnInit(): void {
    this.idUser=this.decodeTokenPayload(this.token).id;
    this.isEditMode = !!this.data?.idCategorie; // Détermine si le composant est en mode édition

    // Initialisation du formulaire réactif avec validation
    this.form = this.fb.group({
      iduser: [this.data?.idUser || '', ], // Champ nom
      nom: [this.data?.nomCategorie || '', [Validators.required, Validators.minLength(3)]], // Champ nom
      domaine: [this.data?.domaine || '', [Validators.required, Validators.minLength(3)]], // Champ domaine
      description: [
        this.data?.description || '', // Champ description
        [Validators.required, Validators.minLength(3), Validators.maxLength(35)]
      ],
      image: [null, this.isEditMode ? []: [Validators.required]] // Champ image requis sauf en mode édition
    });

   
  // ⚠️ Conversion correcte de l'image binaire base64 en source utilisable dans <img>
  if (this.data?.image) {
    this.imagePreview = `data:image/png;base64,${this.data.image}`; // <-- Ajout du préfixe
  }
  }

  // Déclenche le clic sur le champ input de type file pour ouvrir le sélecteur de fichiers
  triggerFileInput(): void {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    if (input) {
      input.click(); // Ouvre le sélecteur de fichier
    }
  }

  // Méthode appelée lorsqu’un fichier est sélectionné
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]; // Récupère le fichier sélectionné

    if (!file) return; // Si aucun fichier n’est sélectionné, on quitte

    // Vérifie si le fichier est bien une image
    if (!file.type.startsWith('image/')) {
      this.message = 'Le fichier sélectionné doit être une image.'; // Message d’erreur
      return;
    }

    const reader = new FileReader(); // Crée un FileReader pour lire le fichier image
    reader.onload = () => {
      this.imagePreview = reader.result; // Affecte le résultat (base64) à imagePreview
      this.message = ''; // Réinitialise le message
      this.form.patchValue({ image: file }); // Met à jour le champ "image" dans le formulaire
    };
    reader.readAsDataURL(file); // Lit le fichier comme une URL base64
  }

  // Ferme la boîte de dialogue sans soumettre
  onCancel(): void {
    this.dialogRef.close(true); // Ferme le dialogue (true peut indiquer une annulation)
  }

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
  // Soumet le formulaire (ajout ou mise à jour d’une catégorie)
  onSubmit(): void {
    if (this.form.invalid) {
      return; // Si le formulaire est invalide, on ne soumet pas
    }

    const formData = new FormData(); // Crée un objet FormData pour l’envoi multipart/form-data
    formData.append('nomCategorie', this.form.get('nom')?.value); // Ajoute le nom
    formData.append('domaine', this.form.get('domaine')?.value); // Ajoute le domaine
    formData.append('description', this.form.get('description')?.value); // Ajoute la description
    formData.append('idUser',this.idUser.toString()); // Ajoute l'ID utilisateur
    const imageFile = this.form.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile); // Ajoute l’image au formulaire si elle existe
    }

    // Mode édition : mise à jour de la catégorie existante
    if (this.isEditMode && this.data?.idCategorie) {
      this.categorieService.updateCategory(this.data.idCategorie, formData).subscribe({
        next: () => {this.dialogRef.close(true),
        this.showSuccess('Ressource modifiée avec succès');}, // Ferme le dialogue en cas de succès
        error: (err) => console.error('Erreur lors de la mise à jour', err) // Affiche une erreur
      });
    } else {
      // Mode ajout : création d’une nouvelle catégorie
      this.categorieService.addCategorie(formData).subscribe({
        next: (response) =>{ this.dialogRef.close(true),
        this.showSuccess('Ressource créée avec succès');}, // Ferme le dialogue en cas de succès
        error: (err) => console.error('Erreur lors de l\'ajout', err) // Affiche une erreur
      });
    }
  }


  
//user 


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
