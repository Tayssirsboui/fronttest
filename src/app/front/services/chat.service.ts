import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5020/api/chatbot/message'; // URL de ton backend Spring Boot

  constructor(private http: HttpClient) {}

  getResponse(userMessage: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, userMessage);
  }
}
