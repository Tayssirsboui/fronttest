import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';
import { ProjetService } from 'src/app/services/projet.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      competencesRequises: [data?.competencesRequises || [], Validators.required]
    });
  }

  onSubmit(): void {
    const projet = this.projetForm.value;
  
    // Convertir la string en tableau si c'est un ajout
    if (typeof projet.competencesRequises === 'string') {
      projet.competencesRequises = projet.competencesRequises
        .split(',')
        .map((c: string) => c.trim());
    }
  
    if (!this.isEditMode) {
      projet.dateCreation = new Date(); // Ajout automatique de la date
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
