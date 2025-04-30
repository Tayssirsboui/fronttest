export class Post {
    id!: number;
    userId!: number;
    likes!: number;
    title!: string;
    content!: string;
    imageUrl!: string; 
    createdBy!: string;
    createdAt!: Date;
    commentsCount!: number; // Ajoutez cette propriété pour stocker le nombre de commentaires
    similarity?: number;
    allowComments?: boolean;
    
 }