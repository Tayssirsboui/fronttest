import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { ParticipationService } from 'src/app/services/participation.service';
import { MatDialog } from '@angular/material/dialog';
import { EvenementDetailsModalComponent } from '../evenement-details-modal/evenement-details-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendrier-utilisateur',
  templateUrl: './calendrier-utilisateur.component.html',
})
export class CalendrierUtilisateurComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listYear'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'block'
  };

  userData: any;
  userId: number | undefined;

  constructor(
    private participationService: ParticipationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    if (!this.userId) {
      Swal.fire('Erreur', 'Utilisateur non connecté.', 'error');
      return;
    }

    this.participationService.getParticipationsOfUser(this.userId).subscribe({
      next: (participations) => {
        const now = new Date();

        const events = participations.map((p, i) => {
          const isFuture = new Date(p.dateDebut) > now;

          return {
            id: `part-${p.participationId}-${i}`,
            title: `${p.titre} - ${p.lieu}`,
            start: p.dateDebut,
            end: p.dateFin,
            extendedProps: {
              titre: p.titre,
              lieu: p.lieu,
              participationId: p.participationId
            },
            backgroundColor: isFuture ? '#28a745' : '#6c757d',
            borderColor: isFuture ? '#28a745' : '#6c757d',
            textColor: '#ffffff',
            allDay: false
          };
        });

        this.calendarOptions.events = events;
      },
      error: (err) => console.error('Erreur chargement participations', err)
    });
  }

  handleEventClick(info: any): void {
    const event = info.event;

    const dialogRef = this.dialog.open(EvenementDetailsModalComponent, {
      width: '500px',
      data: {
        titre: event.extendedProps.titre,
        lieu: event.extendedProps.lieu,
        start: event.start?.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
        end: event.end?.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
        participationId: event.extendedProps.participationId,
        calendarEventId: event.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.deleted && result.calendarEventId) {
        const calendarApi = info.view.calendar;
        const eventToRemove = calendarApi.getEventById(result.calendarEventId);
        if (eventToRemove) {
          eventToRemove.remove();
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
