import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evenement } from 'src/app/models/evenement.model';
import { ListeAttenteService } from 'src/app/services/liste-attente.service.ts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-attente-modal',
  templateUrl: './liste-attente-modal.component.html',
  styleUrls: ['./liste-attente-modal.component.css']
})
export class ListeAttenteModalComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ListeAttenteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement,
    private fb: FormBuilder,
    private listeAttenteService: ListeAttenteService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  envoyerDemande(): void {
    if (this.form.invalid) return;

    const dto = {
      email: this.form.value.email,
      evenement: this.evenement
    };

    this.listeAttenteService.inscrire(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: '✅ Vous avez été inscrit à la liste d\'attente !',
          timer: 2000,
          timerProgressBar: true,
          confirmButtonText: 'OK',
        }).then(() => {
          this.dialogRef.close();
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: '❌ Une erreur est survenue.',
          confirmButtonText: 'Fermer',
        });
      }
    });      
  }}
