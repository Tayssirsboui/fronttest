import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tache } from '../models/tache';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TacheService {

  private baseUrl = 'http://localhost:8222/tache';

  constructor(private http: HttpClient) {}

  getTaches(): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.baseUrl}/retrieve-all-taches`);
  }

  getTachesByProjetId(projetId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.baseUrl}/projet/${projetId}`);
  }
  

  addTache(tache: Tache, projetId: number): Observable<Tache> {
    return this.http.post<Tache>(`${this.baseUrl}/add-tache/${projetId}`, tache);
  }

  updateTache(tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.baseUrl}/modify-tache`, tache);
  }

  deleteTache(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/remove-tache/${id}`);
  }

  updateStatut(id: number, statut: string): Observable<Tache> {
    return this.http.put<Tache>(`${this.baseUrl}/update-statut/${id}`, { statut });
  }
  
  
  
}
