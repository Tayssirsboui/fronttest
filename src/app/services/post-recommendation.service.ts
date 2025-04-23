import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostRecommendationService {
  private apiUrl = 'http://localhost:5120/recommend-posts'; // Flask backend

  constructor(private http: HttpClient) {}

 
  getRecommendedPosts(query: string): Observable<any[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any[]>(this.apiUrl, { params });
  }

}
