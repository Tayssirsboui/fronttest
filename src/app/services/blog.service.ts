import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrlPost = 'http://localhost:5100/api/v1/posts';
  private baseUrlComment = 'http://localhost:5110/api/v1/comments';
  private apiUrl = 'http://localhost:5120/recommend-posts'; 

  constructor(private http : HttpClient) { }
  getPostById(id:number){
    return this.http.get<Post>(this.baseUrlPost+id)
    
  } 
  getPosts() {
    return this.http.get<Post[]>(this.baseUrlPost)
    
  }
  addPostWithImage(formData: FormData): Observable<Post> {
    return this.http.post<Post>(this.baseUrlPost, formData, {
      reportProgress: true, // Pour suivre la progression du téléchargement
      observe: 'response' // Pour obtenir toute la réponse
    }).pipe(
      map(response => response.body as Post),
      catchError(error => {
        console.error('Error in service:', error);
        return throwError (error);
      })
    );
  }
  // addPostWithImage(formData: FormData): Observable<Post> {
  //   return this.http.post<Post>(this.baseUrlPost, formData);
  // }
  
  addPost(postData: any): Observable<Post> {
    return this.http.post<Post>(this.baseUrlPost, postData);
  }
  


  updatePost(id: number,userId:number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrlPost}/${id}/user/${userId}`, post);

  }
  DeletePost(id: number) {
    return this.http.delete(`${this.baseUrlPost}/${id}`);

  }
    getPostsById(id:number){
      return this.http.get<Post>(`${this.baseUrlPost}/${id}`)
      
    } 
    getPostsByUserId(userId: number): Observable<Post[]> {
      return this.http.get<Post[]>(this.baseUrlPost).pipe(
        map(posts => posts.filter(post => post.userId === userId))
      );
    }
    
    // Comment
    
    // getcommentsByPostId(postId: number): Observable<Comment[]> {
    //   const params = new HttpParams().set('postId', postId.toString());
    //   return this.http.get<Comment[]>(`${this.baseUrlComment}/post/${postId}`)
    // }
    getcommentsByPostId(postId: number): Observable<Comment[]> {
      return this.http.get<Comment[]>(`${this.baseUrlComment}/post/${postId}`);
    }
    getComments() {
      return this.http.get<Comment[]>(this.baseUrlComment)
    }
    // addComment(c:Comment){
    //   return this.http.post<Comment>(this.baseUrlComment,c)
      
  
    //  }
    
     addComment(postId: number, userId: number, comment: any): Observable<Comment> {
      return this.http.post<Comment>(`${this.baseUrlComment}/${postId}/${userId}`, comment);
    }
    
     updateComment(commentId: number, userId: number, comment: any): Observable<any> {
      return this.http.put(`${this.baseUrlComment}/${commentId}/user/${userId}`, comment);
    }
    private baseUrlFacebook = 'http://localhost:5100/api/facebook';

postToFacebook(message: string): Observable<any> {
  return this.http.post(`${this.baseUrlFacebook}/post`, { message });
}
getRecommendedPosts(query: string): Observable<any[]> {
  const params = new HttpParams().set('query', query);
  return this.http.get<any[]>(this.apiUrl, { params });
}
    
    
  }
