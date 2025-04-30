import { User } from "../services/models";

export interface Post {
  id: number;
  userId: number;
    title: string;
    content: string;
    createdAt: string;  // Ajout du champ createdAt
    imageUrl?: string; // ✅ Nouveau champ pour afficher l’image
    videoUrl: '' // ✅ Ajouter ceci
    upvotes: number;
    downvotes: number;
    userVote?: 'upvote' | 'downvote' | null;
    //userName: string;
    //userImage: string; 
    user:User;



    
  }
  
  export interface CommunityWithPostsDTO {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    posts: Post[];
  }

 
  