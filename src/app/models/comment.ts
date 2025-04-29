import { User } from "../services/models";

export interface Comment {
  idComment: number;
  userId: number;
  likes: number;
  description: string;
  createdBy: string;
  createdAt: Date;
  postId: number;
  userReaction?: 'like' | 'dislike';
  likedBy: any[];
  likedByUser?: boolean; // Indicates if the current user has liked the comment
  user:User; 
}
