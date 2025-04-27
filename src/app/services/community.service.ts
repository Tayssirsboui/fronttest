import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommunityWithPostsDTO } from 'src/app/models/community.model';
import { PostDTO } from '../models/post-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiUrl = 'http://localhost:5600/api/communities';

  constructor(private http: HttpClient) {}

  getAllCommunities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCommunity(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCommunity(community: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, community);
  }

  joinCommunity(communityId: number, userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${communityId}/join/${userId}`, {});
  }

  getPosts(communityId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${communityId}/posts`);
  }

  getCommunityWithPosts(communityId: number): Observable<CommunityWithPostsDTO> {
    return this.http.get<CommunityWithPostsDTO>(`${this.apiUrl}/${communityId}`);
  }
  createPost(communityId: number, postDTO: PostDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${communityId}/post`, postDTO);
  }
}
