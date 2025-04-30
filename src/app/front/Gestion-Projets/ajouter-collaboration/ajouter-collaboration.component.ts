import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollaborationService } from 'src/app/services/collaboration.service';
import { AuthentificationService } from 'src/app/services/services';

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
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
