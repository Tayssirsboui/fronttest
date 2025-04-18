import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListeAttente } from '../models/liste-attente.model';

@Injectable({
  providedIn: 'root'
})
export class ListeAttenteService {
  private apiUrl = 'http://localhost:8089/backend/liste-attente';

  constructor(private http: HttpClient) {}

  inscrire(demande: ListeAttente): Observable<ListeAttente> {
    return this.http.post<ListeAttente>(`${this.apiUrl}/inscrire`, demande);
  }
}
