// src/app/services/comment-enhancement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class postRecommendationService {
  private apiUrl = 'http://localhost:5120/enhance-comment';

  constructor(private http: HttpClient) {}

  enhanceComment(comment: string): Observable<{ enhanced_comment: string }> {
    return this.http.post<{ enhanced_comment: string }>(this.apiUrl, { comment });
  }
}
