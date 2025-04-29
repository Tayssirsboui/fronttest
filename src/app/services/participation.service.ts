import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParticipationDetails } from '../models/participation-details.model';
import { Evenement } from '../models/evenement.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8222/participations';
  private evenementUrl = 'http://localhost:8222/evenements';

  constructor(private http: HttpClient) {}

  // ✅ Ajouter une participation avec utilisateurId inclus
  ajouter(participationDto: { evenementId: number; utilisateurId: number; statut: string }): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiUrl}/add-participation`, participationDto);
  }

  // ❌ Annuler une participation
  annuler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/annuler/${id}`);
  }

  // 🔄 Obtenir un événement mis à jour
  getEvenementById(id: number): Observable<Evenement> {
    return this.http.get<Evenement>(`${this.evenementUrl}/retrieve-evenement/${id}`);
  }

  // ✅ Compter les participants
  countByEvent(eventId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count-by-evenement/${eventId}`);
  }

  // 📋 Détails des participations par événement
  getParticipationDetailsByEvenement(evenementId: number): Observable<ParticipationDetails[]> {
    return this.http.get<ParticipationDetails[]>(`${this.apiUrl}/evenement/${evenementId}/participations-details`);
  }
}
