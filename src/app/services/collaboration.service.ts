import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collaboration } from '../models/collaboration';

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
  private apiUrl = 'http://localhost:5210/collaboration';

  constructor(private http: HttpClient) {}

  addCollaboration(collaboration: Collaboration): Observable<Collaboration> {
    return this.http.post<Collaboration>(`${this.apiUrl}/add-collaboration`, collaboration);
  }

  getCollaborations(): Observable<Collaboration[]> {
    return this.http.get<Collaboration[]>(`${this.apiUrl}/retrieve-all-collaborations`);
  }
  deleteCollaboration(id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5210/collaboration/remove-collaboration/' + id);
  }
  updateCollaboration(collaboration: Collaboration): Observable<Collaboration> {
      return this.http.put<Collaboration>('http://localhost:5210/collaboration/modify-collaboration', collaboration);
    }
}
