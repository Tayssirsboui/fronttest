export interface ReactionRequest {
    utilisateurId: number;
    evenementId: number;
    type: 'LIKE' | 'DISLIKE';
  }
  