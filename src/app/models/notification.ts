export class Notification {
    id?: number;
    message!: string;
    receiverId!: number;
    senderId!: number; 
    projetId!: number;
    type!: string;
    timestamp?: Date;
    seen?: boolean;
  }
  