import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private http: HttpClient) {}

  getProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>('http://localhost:5200/projet/retrieve-all-projets');
  }

  getProjetById(id: number): Observable<Projet> {
    return this.http.get<Projet>('http://localhost:5200/projet/retrieve-projet/' + id);
  }

  addProjet(projet: Projet): Observable<Projet> {
    return this.http.post<Projet>('http://localhost:5200/projet/add-projet', projet);
  }

  updateProjet(projet: Projet): Observable<Projet> {
    return this.http.put<Projet>('http://localhost:5200/projet/modify-projet', projet);
  }

  deleteProjet(id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5200/projet/remove-projet/' + id);
  }
}
