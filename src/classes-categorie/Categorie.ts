export interface Categorie {
    idUser: number;
    idCategorie: number;
    nomCategorie: string;
    domaine: string;
    description: string;
    dateCreation: string;
    image: string;
    likes?: number; // Champ optionnel pour les likes
  }