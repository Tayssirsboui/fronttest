import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { catchError, map, Observable, throwError } from 'rxjs';
import {  of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseUrlPost = 'http://localhost:8222/api/v1/posts';
  private baseUrlComment = 'http://localhost:8222/api/v1/comments';
  private apiUrl = 'http://localhost:5122/recommend-posts'; 
userId!: number ;
  constructor(private http : HttpClient) { }
  getPostById(id:number){
    return this.http.get<Post>(this.baseUrlPost+id)
    
  } 
  getPosts() {
    return this.http.get<Post[]>(this.baseUrlPost)
    
  }
  addPostWithImage(formData: FormData,userId:number): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrlPost}/${userId}`, formData, {
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
  
  addPost(postData: any,userId:number): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrlPost}/${userId}`, postData);
  }
  


  updatePost(postId: number, userId: number, formData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrlPost}/${postId}/user/${userId}`, formData);
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
    
    
    updateComment(commentId: number, userId: number, commentData: any): Observable<Comment> {
      return this.http.put<Comment>(`${this.baseUrlComment}/${commentId}/user/${userId}`, commentData);
    }
    getRecommendedPosts(userPost: string): Observable<any> {
      const payload = { user_post: userPost };
      return this.http.post<any>('http://localhost:5122/recommend-posts', payload);
    }
    
    deleteComment(commentId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrlComment}/${commentId}`);
    }
    getIrningData(): Observable<any> {
      // Simuler des données d'API
      return of({
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        values: [140, 120, 100, 80, 60, 40, 60, 80, 100, 120]
      });
    }
     // Calculer les statistiques des posts
  getDashboardStats() {
    return this.getPosts().pipe(
      map(posts => {
        const totalPosts = posts.length;
        const totalComments = posts.reduce((acc, post) => acc + post.commentsCount, 0);
        const activeAuthors = new Set(posts.map(post => post.createdBy)).size;
        const mostLikedPost = posts.reduce((max, post) => post.likes > max.likes ? post : max, posts[0]);

        return {
          totalPosts,
          totalComments,
          activeAuthors,
          mostLikedPost: mostLikedPost.title
        };
      })
    );
    
  }
  likeComment(commentId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrlComment}/${commentId}/like/${userId}`, {});

  }
  deleteCommentsByPostId(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlComment}/post/${postId}`);
  }
    
  }
