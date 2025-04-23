// src/app/services/comment-enhancement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class postRecommendationService {
  private apiUrlE = 'http://localhost:5120/enhance-comment';
  private apiUrl = 'http://localhost:5120/recommend-posts'; // Flask backend

  constructor(private http: HttpClient) {}

  enhanceComment(comment: string): Observable<{ enhanced_comment: string }> {
    return this.http.post<{ enhanced_comment: string }>(this.apiUrlE, { comment });
  }


 
  // getRecommendedPosts(query: string): Observable<any[]> {
  //   const params = new HttpParams().set('query', query);
  //   return this.http.get<any[]>(this.apiUrl, { params });
  // }
}
