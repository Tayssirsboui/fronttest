import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Evenement } from 'src/app/models/evenement.model';
import { ParticipationService } from 'src/app/services/participation.service';
import { StatutParticipation } from 'src/app/models/statut-participation.enum';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'; // ✅ Import du Router

@Component({
  selector: 'app-participation-modal',
  templateUrl: './participation-modal.component.html'
})
export class ParticipationModalComponent {
  userData: any;
  userId: number | undefined;

  constructor(
    public dialogRef: MatDialogRef<ParticipationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public evenement: Evenement,
    private participationService: ParticipationService,
    private router: Router // ✅ Injection du Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  confirmerParticipation(): void {
    if (!this.userId || !this.userData) {
      Swal.fire('Erreur', 'Utilisateur non connecté.', 'error');
      return;
    }

    const participation = {
      evenementId: this.evenement.id,
      utilisateurId: this.userId,
      nomUtilisateur: this.userData.fullName,
      emailUtilisateur: this.userData.sub,
      statut: StatutParticipation.EN_ATTENTE
    };

    this.participationService.ajouter(participation).subscribe({
      next: updatedEvent => {
        Swal.fire({
          title: 'Participation confirmée 🎉',
          text: 'Vous êtes inscrit avec succès !',
          icon: 'success',
          timer: 2000
        }).then(() => {
          this.dialogRef.close(updatedEvent);
          this.router.navigate(['/evenement']); // ✅ Redirection après succès
        });
      },
      error: (error) => {
        if (error.status === 409) {
          const message = typeof error.error === 'string' ? error.error : error.error?.message;
          Swal.fire({
            icon: 'error',
            title: 'Déjà inscrit',
            text: message || "Vous avez déjà participé à cet événement.",
            confirmButtonColor: '#d33'
          }).then(() => {
            this.dialogRef.close(); // ✅ Fermer la modale
            this.router.navigate(['/evenement']); // ✅ Redirection propre
          });

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error.error?.message || "Une erreur est survenue, veuillez réessayer.",
            confirmButtonColor: '#d33'
          });
        }
      }
    });
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        const rawId = payload.id;
        this.userId = rawId ? Number(rawId) : undefined;
        console.log("Utilisateur connecté :", this.userData);
      }
    } else {
      console.error('Token non trouvé dans localStorage');
      Swal.fire('Erreur', 'Utilisateur non connecté', 'error');
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token', error);
      return null;
    }
  }
}
