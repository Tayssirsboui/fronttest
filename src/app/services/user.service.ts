import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Utilisateur statique pour les tests
  currentUser = {
    id: 1,
    username: 'alice',
    imageUrl: 'https://img.freepik.com/photos-gratuite/jeune-belle-fille-posant-dans-veste-cuir-noire-parc_1153-8104.jpg?semt=ais_hybrid&w=740'
  };

  getCurrentUser() {
    return this.currentUser;
  }
}
