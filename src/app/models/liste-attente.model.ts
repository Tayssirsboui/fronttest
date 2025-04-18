import { Evenement } from './evenement.model';

export interface ListeAttente {
  id?: number;
  email: string;
  evenement: Evenement;
  dateInscription?: Date;
  notificationEnvoyee?: boolean;
}
