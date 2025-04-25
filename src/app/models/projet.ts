import { Collaboration } from './collaboration';
import { Tache } from './tache';

export class Projet {
  id!: number;
  titre!: string;
  description!: string;
  categorie!: string;
  statut!: string;
  dateCreation!: Date;
  dateFinPrevue!: Date;
  nombreMaxCollaborateurs!: number;
  competencesRequises: string[] = [];
  collaborations?: Collaboration[];
  taches: Tache[] = []; // ✅ Ajout de cette ligne
}
