export class PostDTO {
    constructor(
      public id: number,
      public userId: number,
      public communityId: number,
      public content: string,
      public createdAt?: string , // Facultatif, car il sera automatiquement ajouté côté backend
      public imageUrl?: string,    // ✅ Nouveau champ
      public videoUrl?: string,
      public upvotes: number = 0,  // Nouveau champ pour les upvotes
    public downvotes: number = 0,  // Nouveau champ pour les downvotes
    public userVote?: 'upvote' | 'downvote' | null,
    


      
    ) {}
  }
  