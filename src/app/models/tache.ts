// src/app/models/tache.ts

import { Projet } from './projet';

export class Tache {
  id?: number;
  titre!: string;
  description!: string;
  statut!: 'À faire' | 'En cours' | 'Terminé';
  priorite!: 'Haute' | 'Moyenne' | 'Faible';
  estimation?: string;
  projetId?: number;
  projet?: Projet;
}
