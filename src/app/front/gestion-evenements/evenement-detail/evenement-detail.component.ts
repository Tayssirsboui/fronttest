import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evenement } from 'src/app/models/evenement.model';

@Component({
  selector: 'app-evenement-detail',
  templateUrl: './evenement-detail.component.html'
})
export class EvenementDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<EvenementDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
