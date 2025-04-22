import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EvenementService } from 'src/app/services/evenement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-evenement-modal',
  templateUrl: './evenement-modal.component.html',
  styleUrls: ['./evenement-modal.component.css']
})
export class EvenementModalComponent implements OnInit {
  form!: FormGroup;
  imageFile!: File;
  imagePreview: string | null = null;
  generatedImageBlob: Blob | null = null;
  isGenerating = false; // ✅ barre de chargement

  constructor(
    private dialogRef: MatDialogRef<EvenementModalComponent>,
    private fb: FormBuilder,
    private evenementService: EvenementService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      lieu: ['', Validators.required],
      categorie: ['', Validators.required],
      nbMaxParticipants: [0, [Validators.required, Validators.min(1)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  genererImage(): void {
    const description = this.form.get('description')?.value;
    if (!description) return;

    const formData = new FormData();
    formData.append('prompt', description);

    this.isGenerating = true;

    this.http.post('http://localhost:8000/generate-image/', formData, { responseType: 'blob' })
      .subscribe({
        next: (blob: Blob) => {
          this.generatedImageBlob = blob;

          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result as string;
            this.imageFile = new File([blob], 'generated.png', { type: 'image/png' });
            this.isGenerating = false;
          };
          reader.readAsDataURL(blob);
        },
        error: (err) => {
          console.error('Erreur génération image IA', err);
          this.snackBar.open("❌ Échec de la génération de l'image", 'Fermer', { duration: 3000 });
          this.isGenerating = false;
        }
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('titre', this.form.value.titre);
    formData.append('description', this.form.value.description);
    formData.append('lieu', this.form.value.lieu);
    formData.append('categorie', this.form.value.categorie);
    formData.append('nbMaxParticipants', this.form.value.nbMaxParticipants.toString());
    formData.append('dateDebut', this.formatDate(this.form.value.dateDebut));
    formData.append('dateFin', this.formatDate(this.form.value.dateFin));
    formData.append('statut', 'A_VENIR');
    formData.append('dateCreation', new Date().toISOString().slice(0, 16));

    if (this.generatedImageBlob) {
      formData.append('image', this.generatedImageBlob, 'generated.png');
    } else if (this.imageFile) {
      formData.append('image', this.imageFile, this.imageFile.name);
    }

    this.evenementService.createWithFormData(formData).subscribe({
      next: (data) => {
        this.snackBar.open('✅ Événement ajouté avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        this.dialogRef.close(data);
      },
      error: err => {
        console.error('Erreur:', err);
        this.snackBar.open('❌ Une erreur est survenue.', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
