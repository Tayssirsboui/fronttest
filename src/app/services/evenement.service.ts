import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement.model';


@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  
   private apiUrl = 'http://localhost:8222/evenements';
  
    constructor(private http: HttpClient) { }
    
    getAll(): Observable<Evenement[]> {
      return this.http.get<Evenement[]>(`${this.apiUrl}/retrieve-all-evenements`);
    }
  
    getById(id: number): Observable<Evenement> {
      return this.http.get<Evenement>(`${this.apiUrl}/retrieve-evenement/${id}`);
    }
  
    create(evenement: Evenement): Observable<Evenement> {
      return this.http.post<Evenement>(`${this.apiUrl}/add-evenement`, evenement);
    }
  
    update(evenement: Evenement): Observable<Evenement> {
      return this.http.put<Evenement>(`${this.apiUrl}/modify-evenement`, evenement);
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/remove-evenement/${id}`);
    }
    createWithFormData(formData: FormData) {
      return this.http.post(`${this.apiUrl}/add-evenement`, formData);
    }
    updateWithFormData(formData: FormData): Observable<any> {
      return this.http.put(`${this.apiUrl}/modify-evenement`, formData);
    }
    getEvenementsParUtilisateur(utilisateurId: number): Observable<Evenement[]> {
      return this.http.get<Evenement[]>(`http://localhost:8222/participations/evenements-par-utilisateur/${utilisateurId}`);
    }
    
    
      // 🔥 Nouveauté : événements NON_TRAITE pour l’admin
  getNonTraites(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/non-traite`);
  }

  // 🔁 Mise à jour du statut
  changerStatut(id: number, statut: 'APPROUVE' | 'REJETE'): Observable<Evenement> {
    return this.http.put<Evenement>(`${this.apiUrl}/changer-statut/${id}?statut=${statut}`, {});
  }
  
  getApprouves(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/approuves`);
  }
  countParticipants(id: number) {
    return this.http.get<number>(`${this.apiUrl}/count-participants/${id}`);
  }
  getStatsGlobale(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats-globale`);
  }
  
  downloadPdf(): void {
    const url = 'http://localhost:8222/evenements/export/pdf';
    window.open(url, '_blank');
  }

  getEvenementsCreesParUtilisateur(userId: number): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/evenements-crees-utilisateur/${userId}`);
  }
  
  supprimerEvenement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-evenement/${id}`);
  }
  getReactions(evenementId: number): Observable<{ likes: number; dislikes: number }> {
    return this.http.get<{ likes: number; dislikes: number }>(`http://localhost:8222/evenements/reaction/count/${evenementId}`);
  }
  
}

