import { Injectable } from '@angular/core';
import { Categorie } from 'src/classes-categorie/Categorie';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { FullResources, Ressource } from 'src/classes-categorie/ressource';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {
  private apiUrl = 'http://localhost:5020/categorie'; // Remplacez par l'URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour ajouter une catégorie
  addCategorie(data: FormData): Observable<any> {
    return this.http.post('http://localhost:5020/categorie/add-categorie-with-image', data);
  }
  
  // Méthode pour récupérer les catégories
  getcategorie(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://localhost:5020/categorie/retrieve-all-categories');
  }


  updateCategorieLikes(id: number, likes: number): Observable<any> {
    const url = `http://localhost:5020/categorie/update-likes/${id}?likes=${likes}`;
    console.log(`URL appelée : ${url}`);
    return this.http.put(url, {}); // Envoyer un body vide car `likes` est déjà dans l'URL
  }
  
  // Méthode pour supprimer une catégorie
  deletecategorie(id: number): Observable<void> {
    const url = `http://localhost:5020/categorie/remove-categorie/${id}`; // Remplacez par l'URL de votre API
    return this.http.delete<void>(url);

  }
  updateCategory(id: number, formData: FormData) {
    return this.http.put(`http://localhost:5020/categorie/modify-categorie/${id}`, formData);
  }
  

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`http://localhost:5020/categorie/retrieve-categorie-with-image/${id}`);
  }

getAllResourcesbyIdCategorie(id: number): Observable<FullResources> {
  return this.http.get<FullResources>(`http://localhost:5020/categorie/${id}`);
}
 //favorite
 // Ajouter un favori
 ajouterFavori(idUser: number, idCategorie: number): Observable<void> {
  return this.http.post<void>(`${this.apiUrl}/api/favoris/ajouter`, null, {
    params: { idUser, idCategorie }
  });
}
// Retirer un favori
retirerFavori(idUser: number, idCategorie: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/api/favoris/retirer`, {
    params: { idUser, idCategorie }
  });
}
// Récupérer les favoris d'un utilisateur

getFavoris(idUser: number): Observable<Categorie[]> {
  return this.http.get<Categorie[]>(`${this.apiUrl}/api/favoris/utilisateur/${idUser}`);
}
// Méthode pour liker une catégorie
likeCategorie(categorieId: number, userId: number): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/${categorieId}/like?userId=${userId}`, 
    {}
  ).pipe(
    catchError((error) => {
      if (error.status === 400) {
        // L'utilisateur a déjà liké
        return throwError(() => new Error('Vous avez déjà liké cette catégorie'));
      }
      return throwError(() => new Error('Erreur lors du like'));
    })
  );
}

}
