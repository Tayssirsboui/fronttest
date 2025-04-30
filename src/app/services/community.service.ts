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

  createCommunity(community: any,userId:number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/${userId}`, community);
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
  deleteCommunity(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getCommunitiesByUser(userId: number) {
    return this.http.get<CommunityWithPostsDTO[]>(`${this.apiUrl}/user/${userId}/created`);
  }
  getFavorites(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favoris/user/${userId}`);
  }
  
  toggleFavorite(communityId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/favoris/add?userId=${userId}&communityId=${communityId}`, {});
  }
  upvote(postId: number, userId: number): Observable<any> {
    return this.http.post(`http://localhost:5600/api/communities/${postId}/upvote`, { userId });
  }
  
  downvote(postId: number, userId: number): Observable<any> {
    return this.http.post(`http://localhost:5600/api/communities/${postId}/downvote`, { userId });
  }
  
  
}
