import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stage {
    id?: number; // pour update
    type: string;
    domaine: string;
    entreprise: string;
    dateDebut: string;
    dateFin: string;
    payant: boolean;
    email: string;
    phoneNumber: string;
    description: string;
  }
  
  

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private apiUrl = 'http://localhost:8222/stages/api/stages'; // via gateway (StripPrefix=1)

  constructor(private http: HttpClient) {}

  createStage(stage: Stage): Observable<Stage> {
    return this.http.post<Stage>(`${this.apiUrl}`, stage);
  }

  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.apiUrl}`);
  }

  getStageById(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.apiUrl}/${id}`);
  }

  deleteStage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStage(id: number, stage: Stage): Observable<Stage> {
    return this.http.put<Stage>(`${this.apiUrl}/${id}`, stage);
  }
}
