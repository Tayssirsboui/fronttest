import { Component, Inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParticipationService } from 'src/app/services/participation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evenement-details-modal',
  templateUrl: './evenement-details-modal.component.html',
})
export class EvenementDetailsModalComponent {
  showMap = false;
  mapUrl!: SafeResourceUrl;

  constructor(
    public dialogRef: MatDialogRef<EvenementDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titre: string;
      lieu: string;
      start: string;
      end: string;
      participationId: number;
      calendarEventId: string;
    },
    private participationService: ParticipationService,
    private sanitizer: DomSanitizer
  ) {}

  supprimerParticipation(): void {
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Vous allez supprimer votre participation à cet événement.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then(result => {
      if (result.isConfirmed) {
        this.participationService.annuler(this.data.participationId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Supprimé ✅',
              text: 'Votre participation a été supprimée.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.dialogRef.close({
              deleted: true,
              calendarEventId: this.data.calendarEventId
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erreur ❌',
              text: 'Une erreur est survenue.',
              icon: 'error',
              confirmButtonText: 'Fermer'
            });
          }
        });
      }
    });
  }

  afficherMap(): void {
    const encoded = encodeURIComponent(this.data.lieu);
    const url = `https://www.google.com/maps?q=${encoded}&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showMap = true;
  }
}
