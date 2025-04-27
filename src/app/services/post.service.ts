import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8222/api/posts';

  constructor(private http: HttpClient) {}

  createPost(post: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, post);
  }
  deletePost(postId: number) {
    return this.http.delete(`http://localhost:8222/api/communities/posts/${postId}`);
  }
  
  generatePost(communityId: number) {
    return this.http.post<any>(`http://localhost:8222/api/communities/generate/${communityId}`, {});
  }
  
  
  
}
