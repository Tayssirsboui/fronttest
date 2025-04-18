import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EvenementService } from 'src/app/services/evenement.service';
import { StatutEvenement } from 'src/app/models/statut-evenement.enum';

@Component({
  selector: 'app-evenement-modal',
  templateUrl: './evenement-modal.component.html',
  styleUrls: ['./evenement-modal.component.css']
})
export class EvenementModalComponent implements OnInit {
  form!: FormGroup;
  imageFile!: File;
  imagePreview: string | null = null;
  showToast: boolean = false;

  fields = [
    { name: 'titre', label: 'Titre', type: 'text', placeholder: 'Titre de l\'événement', required: true, error: 'Le titre est obligatoire' },
    { name: 'dateDebut', label: 'Date de début', type: 'datetime-local', required: true, error: 'La date de début est obligatoire' },
    { name: 'lieu', label: 'Lieu', type: 'text', placeholder: 'Lieu de l\'événement', required: true, error: 'Le lieu est obligatoire' },
    { name: 'dateFin', label: 'Date de fin', type: 'datetime-local', required: true, error: 'La date de fin est obligatoire' },
    { name: 'categorie', label: 'Catégorie', type: 'text', placeholder: 'Catégorie', required: true, error: 'La catégorie est obligatoire' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description', required: true, error: 'La description est obligatoire' },
    { name: 'nbMaxParticipants', label: 'Nombre max de participants', type: 'number', placeholder: 'Ex : 100', required: true, error: 'Ce champ est requis et doit être > 0' },
  ];

  constructor(
    private dialogRef: MatDialogRef<EvenementModalComponent>,
    private fb: FormBuilder,
    private evenementService: EvenementService
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

  private formatLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    formData.append('statut', StatutEvenement.A_VENIR);
    formData.append('dateCreation', this.formatLocalDateTime(new Date()));

    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.evenementService.createWithFormData(formData).subscribe({
      next: (data) => {
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
          this.dialogRef.close(data);
        }, 2000);
      },
      error: err => {
        console.error('Erreur:', err);
        alert('Une erreur est survenue.');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
