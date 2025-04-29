import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:5600/api/posts';

  constructor(private http: HttpClient) {}

  createPost(id:number,post: any,userId:number): Observable<any> {
    return this.http.post<any>(`this.apiUrl/${id}/post/${userId}`, post);
  }
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5600/api/communities/posts/${id}`);
  }
  generatePost(communityId: number) {
    return this.http.post<any>(`http://localhost:5600/api/communities/generate/${communityId}`, {});
  }
  reportPost(id: number): Observable<any> {
    return this.http.post(`http://localhost:5600/api/communities/posts/${id}/report`, {});
  }
  getReportedPosts() {
    return this.http.get<any[]>('http://localhost:5600/api/communities/posts/reported');
  }
  
  
  
  
  
}
