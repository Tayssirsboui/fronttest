import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ParticipationService } from 'src/app/services/participation.service';

@Component({
  selector: 'app-evenement-details-modal',
  templateUrl: './evenement-details-modal.component.html',
})
export class EvenementDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EvenementDetailsModalComponent>,
    private participationService: ParticipationService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      titre: string;
      lieu: string;
      start: string;
      end: string;
      participationId: number;
      calendarEventId: string;
    }
  ) {}

  supprimerParticipation(): void {
    if (confirm('Confirmer la suppression de votre participation ?')) {
      this.participationService.annuler(this.data.participationId).subscribe({
        next: () => {
          this.dialogRef.close({
            deleted: true,
            calendarEventId: this.data.calendarEventId
          });
        },
        error: err => {
          alert("❌ Erreur lors de la suppression !");
          console.error(err);
        }
      });
    }
  }

  fermer(): void {
    this.dialogRef.close();
  }
}
