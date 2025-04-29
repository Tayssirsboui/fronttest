import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomUserServiceService {
  private baseUrl = 'http://localhost:5300/api/users'; // Ajuste selon ton backend

  constructor(private http: HttpClient) {}

  banUser(userId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/ban/${userId}`, {});
  }

  changeUserRole(userId: number, newRole: string): Observable<any> {
    const url = `${this.baseUrl}/change-role/${userId}?role=${newRole}`; // ➡️ ajouter ?role=xxx
    return this.http.patch(url, {}); // corps vide
  }
  unbanUser(userId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/unban/${userId}`, {});
  }
  
}

