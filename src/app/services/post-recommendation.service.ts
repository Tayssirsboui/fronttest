import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostRecommendationService {
  private apiUrl = 'http://localhost:5120/recommend-posts'; // Flask backend

  constructor(private http: HttpClient) {}

  // Send only the mood/user post text
  recommendActivities(userPost: string): Observable<Post[]> {
    return this.http.post<Post[]>(this.apiUrl, { user_post: userPost });
  }

  // Wrapper to use with all activities fetched from backend
  recommendFromAllActivities(userPost: string): Observable<Post[]> {
    return new Observable(observer => {
      this.recommendActivities(userPost).subscribe({
        next: (recommendations) => observer.next(recommendations),
        error: (err) => observer.error(err)
      });
    });
  }
}
