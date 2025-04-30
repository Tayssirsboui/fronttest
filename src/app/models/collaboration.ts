import { Projet } from "./projet";

export class Collaboration {
  id!: number;
  role!: string;
  statut!: string;
  dateDemande?: Date;
  dateValidation?: Date;
  projet!: Projet;
  projetId!: number;
  userId!: number;   // <-- Celui qui a demandé la collaboration (étudiant)
}
