import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Participation } from '../models/participation.model';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:8089/backend/participations';
  private evenementUrl = 'http://localhost:8089/backend/evenements';

  constructor(private http: HttpClient) {}

  // ajouter(participation: Participation): Observable<Participation> {
  //   return this.http.post<Participation>(`${this.apiUrl}/add-participation`, participation);
  // }

  ajouter(participationDto: { evenementId: number; statut: string }): Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiUrl}/add-participation`, participationDto);
  }
    // ❌ Annuler une participation
    annuler(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/annuler/${id}`);
    }
  
    // 🔄 Obtenir un événement mis à jour avec ses participations
    getEvenementById(id: number): Observable<Evenement> {
      return this.http.get<Evenement>(`${this.evenementUrl}/retrieve-evenement/${id}`);
    }
  
    
  
}
