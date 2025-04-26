import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { RessourceService } from 'src/app/front/services/ressource.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ajout-ressources',
  templateUrl: './ajout-ressources.component.html',
  styleUrls: ['./ajout-ressources.component.css']
})
export class AjoutRessourcesComponent implements OnInit {
  form!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  fileNames: string[] = [];
  selectedOption: string = 'LIEN';
  isPayantSelected: boolean = false;
  statusOptions: string[] = ['LIEN', 'ARTICLE', 'PDF', 'IMAGE'];
  message: string = '';
  isEditMode: boolean = false;
  existingImage: string | null = null;
  idCategorie: number | null = null;
 idRessource !: number ;
 
 idUser: number =1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      ressource?: any, 
      idCategorie: number
    },
    private dialogRef: MatDialogRef<AjoutRessourcesComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ressourceService: RessourceService
  ) {}

  ngOnInit(): void {
    console.log('Data reçu:', this.data);
    console.log('Ressource:', this.data?.ressource);
    console.log('ID Ressource:', this.data?.ressource?.id);
    this.isEditMode = !!this.data?.ressource;
    this.idCategorie = this.data.idCategorie;
      // Récupération de l'ID de la ressource
  this.idRessource = this.data?.ressource?.id;
  console.log('ID Ressource:', this.idRessource);
    this.initializeForm();

    if (this.isEditMode && this.data.ressource.imageBase64) {
      this.existingImage = `data:image/png;base64,${this.data.ressource.imageBase64}`;
      this.imagePreview = this.existingImage;
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      iduser: [this.data?.ressource?.idUser || this.idUser],
      titre: [this.data?.ressource?.titre || '', [Validators.required, Validators.minLength(3)]],
      description: [this.data?.ressource?.description || '', [Validators.required, Validators.minLength(3)]],
      type: [this.data?.ressource?.type || 'LIEN'],
      lien: [this.data?.ressource?.lien || ''],
      article: [this.data?.ressource?.text || ''],
      files: [null],
      montant: [{ value: this.data?.ressource?.prix || '', disabled: !this.isPayantSelected }, 
                [Validators.pattern('^[0-9]*$')]],
      image: [null, this.isEditMode ? [] : [Validators.required]],
      statut: [this.data?.ressource?.statut || 'Gratuit']

    });

    this.isPayantSelected = this.form.get('statut')?.value === 'Payant';
    this.selectedOption = this.form.get('type')?.value || 'LIEN';
  }

  onTypeChange(type: string): void {
    this.isPayantSelected = type === 'Payant';
    if (this.isPayantSelected) {
      this.form.get('montant')?.enable();
      this.form.get('statut')?.setValue('Payant');
    } else {
      this.form.get('montant')?.disable();
      this.form.get('montant')?.reset();
      this.form.get('statut')?.setValue('Gratuit');
    }
  }

  onOptionChange(option: string): void {
    this.selectedOption = option;
    this.form.get('type')?.setValue(option);
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      
      // Générer l'aperçu
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Mettre à jour le formulaire
      this.form.patchValue({ image: file });
    }
  }
 /* onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.showError('Veuillez sélectionner une image valide');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.form.patchValue({ image: file });
        this.form.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }*/

  triggerMultipleFileInput(): void {
    document.getElementById('multiFileInput')?.click();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileNames = Array.from(input.files).map(f => f.name);
      this.form.patchValue({ files: input.files });
      this.form.get('files')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    this.idRessource = this.data?.ressource?.id ;
    if (!this.idCategorie) {
      this.showError('ID de catégorie manquant');
      return;
    }

    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.showError('Veuillez corriger les erreurs du formulaire');
      return;
    }

    const formData = new FormData();
    
    // Champs obligatoires
    formData.append('titre', this.form.get('titre')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('status', this.form.get('statut')?.value);
    formData.append('type', this.form.get('type')?.value);
    formData.append('idUser',this.idUser.toString()); // Ajoute l'ID utilisateur


    // Champs conditionnels
    if (this.isPayantSelected) {
      formData.append('prix', this.form.get('montant')?.value);
    }

    // Image
    const imageFile = this.form.get('image')?.value;
    if (imageFile) {
      formData.append('image', imageFile);
    }

    // Gestion des types de contenu
    switch (this.selectedOption) {
      case 'LIEN':
        if (this.form.get('lien')?.value) {
          formData.append('lien', this.form.get('lien')?.value);
        }
        break;
      case 'ARTICLE':
        if (this.form.get('article')?.value) {
          formData.append('text', this.form.get('article')?.value);
        }
        break;
      case 'PDF':
      case 'IMAGE':
        const files = this.form.get('files')?.value;
        if (files) {
          Array.from(files).forEach((file: any) => {
            formData.append('files', file);
          });
        }
        break;
    }

    console.log('Données envoyées:', {
      idUser: this.form.get('iduser')?.value,
      titre: this.form.get('titre')?.value,
      description: this.form.get('description')?.value,
      status: this.form.get('statut')?.value,
      type: this.form.get('type')?.value,
      prix: this.isPayantSelected ? this.form.get('montant')?.value : null,
      lien: this.selectedOption === 'LIEN' ? this.form.get('lien')?.value : null,
      text: this.selectedOption === 'ARTICLE' ? this.form.get('article')?.value : null,
      files: this.selectedOption === 'PDF' || this.selectedOption === 'IMAGE' ? this.fileNames : null
    });

    if (this.isEditMode) {
      // Passez explicitement l'ID de la ressource
      this.updateResource(this.idRessource, formData);
    } else {
      this.createResource(formData);
    }
  }

  private createResource(formData: FormData): void {
    this.ressourceService.addRessource(formData, this.idCategorie!).subscribe({
      next: (response) => {
        this.showSuccess('Ressource créée avec succès');
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Erreur création:', err);
        this.showError(err.error?.message || 'Erreur lors de la création');
      }
    });
  }

  private updateResource(id: number, formData: FormData): void {
    if (!id) {
      this.showError('ID de ressource manquant pour la mise à jour');
      return;
    }
  
    this.ressourceService.updateRessource(id, formData).subscribe({
      next: (response) => {
        this.showSuccess('Ressource mise à jour avec succès');
        
        // Fermer le dialog et retourner l'ID de la ressource et de la catégorie
        this.dialogRef.close({
          success: true,
          idRessource: id,
          idCategorie: this.idCategorie
        });
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        this.showError(err.error?.message || 'Erreur lors de la mise à jour');
      }
    });
  }
/*
  private updateResource(id: number, formData: FormData): void {
    // Utilisez le paramètre id plutôt que this.data.ressource.idRessource
    if (!id) {
      this.showError('ID de ressource manquant pour la mise à jour');
      return;
    }
  
    this.ressourceService.updateRessource(id, formData).subscribe({
      next: (response) => {
        this.showSuccess('Ressource mise à jour avec succès');
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        this.showError(err.error?.message || 'Erreur lors de la mise à jour');
      }
    });
  }*/

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
  selectedFileName: string = '';
  
removeImage() {
  this.imagePreview = null;
  this.selectedFileName = '';
  this.form.patchValue({ image: null });
  // Réinitialiser l'input file
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}


}