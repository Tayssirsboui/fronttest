import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollaborationService } from 'src/app/services/collaboration.service';

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
      projetId: [this.data?.projetId || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.collaborationForm.invalid) return;

    const collab = this.collaborationForm.value;

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
