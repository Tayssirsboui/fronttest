import { Component, OnInit } from '@angular/core';
import { EvenementService } from 'src/app/services/evenement.service';
import { ParticipationService } from 'src/app/services/participation.service';
import { Evenement } from 'src/app/models/evenement.model';
import { ParticipationDetails } from 'src/app/models/participation-details.model';

@Component({
  selector: 'app-liste-participations',
  templateUrl: './liste-participations.component.html',
  styleUrls: ['./liste-participations.component.css']
})
export class ListeParticipationsComponent implements OnInit {

  evenements: Evenement[] = [];
  participationsParEvenement: { [evenementId: number]: ParticipationDetails[] } = {};

  constructor(
    private evenementService: EvenementService,
    private participationService: ParticipationService
  ) {}

  ngOnInit(): void {
    this.loadEvenements();
  }

  loadEvenements(): void {
    this.evenementService.getAll().subscribe({
      next: (data) => {
        this.evenements = data;
        this.evenements.forEach(ev => this.loadParticipations(ev.id));
      },
      error: (err) => console.error('Erreur chargement événements', err)
    });
  }

  loadParticipations(evenementId: number): void {
    this.participationService.getParticipationDetailsByEvenement(evenementId).subscribe({
      next: (data) => {
        this.participationsParEvenement[evenementId] = data;
      },
      error: (err) => console.error(`Erreur chargement participations pour événement ${evenementId}`, err)
    });
  }
}
