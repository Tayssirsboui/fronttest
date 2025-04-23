import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  private apiUrl = 'http://localhost:5600/api/votes';

  constructor(private http: HttpClient) {}

  // Ajouter un vote (upvote ou downvote)
  vote(voteData: { postId: number, voteType: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, voteData);
  }

  // Obtenir le nombre de votes (upvotes et downvotes) pour un post
  getVoteCount(postId: number): Observable<{ upvotes: number, downvotes: number }> {
    return this.http.get<{ upvotes: number, downvotes: number }>(`${this.apiUrl}/${postId}`);
  }
}
