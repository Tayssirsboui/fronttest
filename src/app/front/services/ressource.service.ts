import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

import { Ressource } from 'src/classes-categorie/ressource';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {
  private apiUrl = 'http://localhost:5010/ressources';  // Utilisez environment.ts
  idUser:Number=1;
  constructor(private http: HttpClient) { }

  // Headers avec authentification
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }



  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400: return 'Requête invalide';
      case 401: return 'Authentification requise';
      case 403: return 'Accès refusé';
      case 404: return 'Ressource non trouvée';
      case 500: return 'Erreur interne du serveur';
      default: return `Erreur serveur: ${error.status}`;
    }
  } 

  addRessource(data: FormData, idCategorie: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idCategorie}/ajout-ressource`, data);
  }


  private handleError(error: HttpErrorResponse) {
    console.error('Erreur serveur:', error);
    
    let errorMessage = 'Une erreur est survenue';
    if (error.status === 400) {
      errorMessage = 'Données invalides envoyées au serveur';
    } else if (error.status === 401) {
      errorMessage = 'Authentification requise';
    } else if (error.status === 404) {
      errorMessage = 'Endpoint non trouvé';
    }
    
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      details: error.error?.message || error.message
    }));
  }

  // Récupérer toutes les ressources
  getRessources(): Observable<Ressource[]> {
    return this.http.get<Ressource[]>(`${this.apiUrl}`, { headers: this.getHeaders() })
      .pipe(
        map(res => res || []), // Garantit un tableau vide si null
        catchError(this.handleError)
      );
  }

  // Mettre à jour une ressource
  //méthode pour mettre à jour les ressources
  updateRessource(id: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}/modify-ressource/${id}`, formData);
  }

  // Supprimer une ressource
  deleteRessource(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de ressource invalide'));
    }

    return this.http.delete<void>(
      `${this.apiUrl}/remove-ressource/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Récupérer une ressource par ID
  getRessourceById(id: number): Observable<Ressource> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de ressource invalide'));
    }

    return this.http.get<Ressource>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }
//model IA
generateMindmap(filepath: string): Observable<Blob> {
  const params = new HttpParams().set('filepath', filepath);
  return this.http.get('http://localhost:5010/api/mindmap/generate', {
    params,
    responseType: 'blob'
  });
}


  
}