import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReactionRequest } from '../models/ReactionRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = 'http://localhost:8222/evenements';

  constructor(private http: HttpClient) {}

  // Ajouter ou mettre à jour une réaction (LIKE / DISLIKE)
  ajouterReaction(reaction: ReactionRequest): Observable<string> {
    return this.http.post(this.apiUrl + '/reaction', reaction, { responseType: 'text' });
  }

  // Récupérer le nombre total de likes et dislikes pour un événement
  compterReactions(evenementId: number): Observable<{ likes: number; dislikes: number }> {
    return this.http.get<{ likes: number; dislikes: number }>(`${this.apiUrl}/reaction/count/${evenementId}`);
  }

  // Vérifie si un utilisateur a déjà réagi à un événement (true / false)
  dejaReagi(utilisateurId: number, evenementId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${evenementId}/${utilisateurId}`);
  }

  // Supprimer la réaction d'un utilisateur pour un événement (optionnel)
  supprimerReaction(utilisateurId: number, evenementId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/reaction/${evenementId}/${utilisateurId}`, { responseType: 'text' });
  }

  // 🔥 Récupérer le type de réaction actuel d'un utilisateur pour un événement
  getReactionType(utilisateurId: number, evenementId: number): Observable<'LIKE' | 'DISLIKE' | 'NONE'> {
    return this.http.get<'LIKE' | 'DISLIKE' | 'NONE'>(`${this.apiUrl}/reaction/type/${evenementId}/${utilisateurId}`);
  }
}
