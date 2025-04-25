import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:5200/projet';

  constructor(private http: HttpClient) {}

  generateRoadmap(projetId: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/roadmap/${projetId}`, {});
  }
}
