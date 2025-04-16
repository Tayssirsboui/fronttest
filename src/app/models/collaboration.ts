import { Projet } from "./projet";

export class Collaboration {
    id!: number;
    role!: string;
    statut!: string;
    dateDemande?: Date;
    dateValidation?: Date;
    projet!: Projet;
  }