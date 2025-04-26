export enum TypeRessource {
    LIEN = 'LIEN',
    ARTICLE = 'ARTICLE',
    PDF = 'PDF',
    IMAGE = 'IMAGE',
    PRESENTATION = 'PRESENTATION',
  }
  
  export enum StatutRessource {
  Gratuit='Gratuit',
    Payant='Payant',
    // Ajoute d'autres statuts selon ton enum Java
  }
  
  export interface Fichier {
    idFichier?: number;
    nom?: string;
    url?: string;
    // Ajoute les autres champs de la classe Fichier si nécessaire
  }
  
  export interface Ressource {
    idRessource?: number;
    titre: string;
    description: string;
    prix: number;
    text: string;
    lien: string;
    type: string;
    dateAjout?: string; // LocalDateTime -> string ISO
    statut: StatutRessource;
    image?: string | ArrayBuffer | null; // Si tu récupères une image Base64 ou Blob
    fichiers?: Fichier[];
    idCategorie: number;
    idUser: number;
  }
  export interface FullResources {
    idCategorie: number;
    idUser: number;
    nomCategorie: string;
    domaine: string;
    description: string;
    dateCreation: string; // ISO 8601 string (ex: "2024-04-14T18:00:00")
    ressources: Ressource [];
  }
  