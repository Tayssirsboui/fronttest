export interface Comment {
    id: number;
    userId: number;
    likes: number;
    description: string;
    createdBy: string;
    createdAt: Date;
    postId: number;
    userReaction?: 'like' | 'dislike'; // si tu l’utilises dans le template
 }