import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:5220/api/notifications'; // adapt if your port changes

  constructor(private http: HttpClient) {}

  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
  }
  markAsSeen(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/seen/${notificationId}`, {});
  }
  
}
