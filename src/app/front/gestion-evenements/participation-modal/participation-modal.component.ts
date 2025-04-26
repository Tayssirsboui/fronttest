import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evenement } from 'src/app/models/evenement.model';
import { ParticipationService } from 'src/app/services/participation.service';
import { StatutParticipation } from 'src/app/models/statut-participation.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participation-modal',
  templateUrl: './participation-modal.component.html'
})
export class ParticipationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ParticipationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement,
    private participationService: ParticipationService
  ) {}

  confirmerParticipation(): void {
    const dto = {
      evenementId: this.evenement.id,
      statut: StatutParticipation.EN_ATTENTE
    };

    this.participationService.ajouter(dto).subscribe({
      next: updatedEvent => {
        Swal.fire({
          title: 'Participation confirmée 🎉',
          text: 'Vous êtes inscrit avec succès !',
          icon: 'success',
          timer: 2000
        }).then(() => this.dialogRef.close(updatedEvent));
      },
      error: () => {
        Swal.fire({
          title: 'Erreur ❌',
          text: 'Une erreur est survenue.',
          icon: 'error'
        });
      }
    });
  }
}
