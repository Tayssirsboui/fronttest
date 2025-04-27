export interface Post {
  id: number;
  userId: number;
    title: string;
    content: string;
    createdAt: string;  // Ajout du champ createdAt
    imageUrl?: string; // ✅ Nouveau champ pour afficher l’image
    videoUrl: '' // ✅ Ajouter ceci
    upvotes: number;   // Nouveau champ pour les upvotes
    downvotes: number; // Nouveau champ pour les downvotes
    userVote?: 'upvote' | 'downvote' | null;
    userName: string;
    userImage: string; 



    
  }
  
  export interface CommunityWithPostsDTO {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    posts: Post[];
  }

 
  