import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CollaborationService } from 'src/app/services/collaboration.service';
import { AuthentificationService } from 'src/app/services/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouter-collaboration',
  templateUrl: './ajouter-collaboration.component.html',
  styleUrls: ['./ajouter-collaboration.component.css']
})
export class AjouterCollaborationComponent implements OnInit {
  collaborationForm!: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private collaborationService: CollaborationService,
    private authService: AuthentificationService,   // ✅ ajoute-le ici
    private dialogRef: MatDialogRef<AjouterCollaborationComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.data?.id;
  
    this.collaborationForm = this.fb.group({
      id: [this.data?.id],
      role: [this.data?.role || '', Validators.required],
      statut: [this.data?.statut || 'Non traité'],
      dateDemande: [this.data?.dateDemande || new Date()],
      dateValidation: [this.data?.dateValidation || null],
      projetId: [this.data?.projetId || null, Validators.required]  // ✅ forcé depuis le data
    });
  
    // 👇 AJOUT TRES IMPORTANT !!
    if (this.data?.projetId) {
      this.collaborationForm.patchValue({ projetId: this.data.projetId });
    }
  }

  onSubmit(): void {
    if (this.collaborationForm.invalid) return;

    const collab = this.collaborationForm.value;

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.authService.decodeToken(token);
      collab.userId = decoded?.id;
    }

    if (this.isEditMode) {
      this.collaborationService.updateCollaboration(collab).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.collaborationService.addCollaboration(collab).subscribe(() => {
        this.dialogRef.close(true);
        Swal.fire({
          icon: 'success',
          title: 'Collaboration ajoutée',
          text: 'Votre demande a été envoyée avec succès !',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/collaborations']);
        });
      });
      
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
