import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evenement } from '../models/evenement.model';


@Injectable({
  providedIn: 'root'
})
export class EvenementService {

  
   private apiUrl = 'http://localhost:8089/backend/evenements';
  
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
      return this.http.get<Evenement[]>(`http://localhost:8089/backend/participations/evenements-par-utilisateur/${utilisateurId}`);
    }
    
    
    
}
