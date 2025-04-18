import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Evenement } from 'src/app/models/evenement.model';
import { EvenementService } from 'src/app/services/evenement.service';

@Component({
  selector: 'app-evenement-modifier',
  templateUrl: './evenement-modifier.component.html',
  styleUrls: ['./evenement-modifier.component.css']
})
export class EvenementModifierComponent implements OnInit {
  @Input() data!: Evenement;
  form!: FormGroup;

  imageFile!: File;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private evenementService: EvenementService
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

    // Si l'événement a déjà une image
    if (this.data.image) {
      this.imagePreview = 'http://localhost:8089/backend/' + this.data.image;
    }
  }

  // Format pour input type="datetime-local"
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
        this.activeModal.close(true); // Fermer avec succès
      },
      error: err => {
        console.error('Erreur lors de la modification', err);
        alert('Une erreur est survenue lors de la modification.');
      }
    });
  }
}
