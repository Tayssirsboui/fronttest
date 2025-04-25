export interface Comment {
    idComment: number; // changed from 'id' to 'idComment'
    userId: number;
    likes: number;
    description: string;
    createdBy: string;
    createdAt: Date;
    postId: number;
    userReaction?: 'like' | 'dislike'; // si tu l’utilises dans le template
    likedBy: any[]
  }
  