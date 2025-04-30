import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';
import { ProjetService } from 'src/app/services/projet.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthentificationService } from 'src/app/services/services';

@Component({
  selector: 'app-ajouter-projet',
  templateUrl: './ajouter-projet.component.html',
  styleUrls: ['./ajouter-projet.component.css']
})
export class AjouterProjetComponent {
  projetForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private authService: AuthentificationService,
    public dialogRef: MatDialogRef<AjouterProjetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Projet
  ) {
    this.isEditMode = !!data?.id;

    this.projetForm = this.fb.group({
      id: [data?.id],
      titre: [data?.titre || '', Validators.required],
      description: [data?.description || '', Validators.required],
      categorie: [data?.categorie || '', Validators.required],
      dateFinPrevue: [data?.dateFinPrevue || '', Validators.required],
      nombreMaxCollaborateurs: [data?.nombreMaxCollaborateurs || 1, [Validators.required, Validators.min(1)]],
      competencesRequises: [data?.competencesRequises || [], Validators.required],
      taches: this.fb.array([]),
      dateCreation: [data?.dateCreation || null] // <<<<<< AJOUT ici
    });
    
  }

  get taches(): FormArray {
    return this.projetForm.get('taches') as FormArray;
  }

  addTache(): void {
    const tacheForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      estimation: ['', Validators.required],
      priorite: ['', Validators.required],
      statut: ['', Validators.required],
    });
    this.taches.push(tacheForm);
  }

  removeTache(index: number): void {
    this.taches.removeAt(index);
  }

  onSubmit(): void {
    const projet = this.projetForm.value;

// Convertir compétences string -> array
if (typeof projet.competencesRequises === 'string') {
  projet.competencesRequises = projet.competencesRequises
    .split(',')
    .map((c: string) => c.trim());
}

// Ajout du userId connecté
const token = localStorage.getItem('token');
if (token) {
  const decoded = this.authService.decodeToken(token);
  projet.userId = decoded?.id;
}

// Date création auto si ajout
if (!this.isEditMode) {
  projet.dateCreation = new Date();
}

if (this.isEditMode) {
  this.projetService.updateProjet(projet).subscribe(() => this.dialogRef.close(true));
} else {
  this.projetService.addProjet(projet).subscribe(() => this.dialogRef.close(true));
}

  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
