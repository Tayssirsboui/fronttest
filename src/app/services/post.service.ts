import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5600/api/posts';

  constructor(private http: HttpClient) {}

  createPost(post: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, post);
  }
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5600/api/communities/posts/${id}`);
  }
  generatePost(communityId: number) {
    return this.http.post<any>(`http://localhost:5600/api/communities/generate/${communityId}`, {});
  }
  
  
  
}
