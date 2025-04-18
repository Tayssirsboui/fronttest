import { Participation } from "./participation.model";
import { StatutEvenement } from "./statut-evenement.enum";



export class Evenement {
    id!: number;
    titre!: string;
    description!: string;
    dateDebut!: Date;
    dateFin!: Date;
    lieu!: string;
    categorie!: string;
    nbMaxParticipants!: number;
    statut!: StatutEvenement;
    dateCreation?: Date = new Date();
    image?: string;

    participations?: Participation[]; // liste des participations liées
  }