import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { EvenementService } from 'src/app/services/evenement.service';
import { ParticipationService } from 'src/app/services/participation.service';
import { Evenement } from 'src/app/models/evenement.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvenementDetailsModalComponent } from '../evenement-details-modal/evenement-details-modal.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private evenementService: EvenementService,
    private participationService: ParticipationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.evenementService.getAll().subscribe({
      next: (evenements: Evenement[]) => {
        const participationsEvents = evenements.flatMap(evenement =>
          (evenement.participations || []).map((p, index) => ({
            id: `part-${p.id}-${index}`, // identifiant unique pour FullCalendar
            title: `${evenement.titre} - ${evenement.lieu}`,
            start: evenement.dateDebut,
            end: evenement.dateFin,
            extendedProps: {
              titre: evenement.titre,
              lieu: evenement.lieu,
              participationId: p.id
            },
            allDay: false
          }))
        );

        this.calendarOptions.events = participationsEvents;
      },
      error: err => console.error('Erreur chargement événements', err)
    });
  }

  // handleEventClick(info: any): void {
  //   const event = info.event;

  //   const modalRef = this.modalService.open(EvenementDetailsModalComponent, { centered: true });

  //   // Données à afficher
  //   modalRef.componentInstance.titre = event.extendedProps.titre;
  //   modalRef.componentInstance.lieu = event.extendedProps.lieu;
  //   modalRef.componentInstance.start = event.start?.toLocaleString('fr-FR', {
  //     dateStyle: 'short',
  //     timeStyle: 'short'
  //   });
  //   modalRef.componentInstance.end = event.end?.toLocaleString('fr-FR', {
  //     dateStyle: 'short',
  //     timeStyle: 'short'
  //   });

  //   // Données pour gestion backend / UI
  //   modalRef.componentInstance.participationId = event.extendedProps.participationId;
  //   modalRef.componentInstance.calendarEventId = event.id;

  //   modalRef.closed.subscribe((result) => {
  //     if (result?.deleted && result.calendarEventId) {
  //       const calendarApi = info.view.calendar;
  //       const eventToRemove = calendarApi.getEventById(result.calendarEventId);
  //       if (eventToRemove) {
  //         eventToRemove.remove(); // ✅ Retirer visuellement l'événement
  //       }
  //     }
  //   });
  // }
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
        if (eventToRemove) eventToRemove.remove();
      }
    });
  }
}
