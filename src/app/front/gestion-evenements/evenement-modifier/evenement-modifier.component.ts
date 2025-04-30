import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evenement } from 'src/app/models/evenement.model';
import { EvenementService } from 'src/app/services/evenement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evenement-modifier',
  templateUrl: './evenement-modifier.component.html',
  styleUrls: ['./evenement-modifier.component.css']
})
export class EvenementModifierComponent implements OnInit {
  form!: FormGroup;
  imageFile!: File;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private evenementService: EvenementService,
    public dialogRef: MatDialogRef<EvenementModifierComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Evenement
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data.id],
      titre: [this.data.titre, Validators.required],
      description: [this.data.description, Validators.required],
      lieu: [this.data.lieu, Validators.required],
      dateDebut: [this.formatDateForInput(this.data.dateDebut), Validators.required],
      dateFin: [this.formatDateForInput(this.data.dateFin), Validators.required],
      categorie: [this.data.categorie, Validators.required],
      nbMaxParticipants: [this.data.nbMaxParticipants, Validators.required]
    });

    if (this.data.image) {
      this.imagePreview = 'http://localhost:8222/' + this.data.image;
    }
  }

  formatDateForInput(date: string | Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    if (this.form.invalid) return;
  
    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
  
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }
  
    this.evenementService.updateWithFormData(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Événement modifié',
          text: 'Les informations ont été mises à jour avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
  
        this.dialogRef.close(true);  // ferme le modal avec succès
      },
      error: err => {
        console.error('Erreur lors de la modification', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la modification.'
        });
      }
    });
  }
  
}
