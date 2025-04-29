import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserControllerService } from 'src/app/services/services';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mes-posts',
  templateUrl: './mes-posts.component.html',
  styleUrls: ['./mes-posts.component.css']
})
export class MesPostsComponent implements OnInit {
  userPosts: Post[] = [];
  userId!: number;
  isLoading = false;
  selectedPostToEdit: Post | null = null;
  showEditModal: boolean = false;
  selectedFile: File | null = null;
  userData: any;
  openMenuId: number | null = null;

  constructor(
    private bs: BlogService,
    private location: Location,
    private toastr: ToastrService,    private userService: UserControllerService
    
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        this.userId = payload.id || payload.userId || payload._id;
        console.log('Connected user:', this.userData);
        this.fetchUserPosts();
      }
    } else {
      console.error('Token not found in localStorage');
      this.toastr.error('User not connected', 'Error');
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode token payload', error);
      return null;
    }
  }

  fetchUserPosts(): void {
    if (!this.userId) {
      console.error('No user ID found to load posts');
      return;
    }
  
    this.isLoading = true;
  
    this.bs.getPostsByUserId(this.userId).subscribe({
      next: (posts) => {
        this.userPosts = posts;
        this.isLoading = false;
  
        if (this.userPosts && this.userPosts.length > 0) {
          this.userPosts.forEach((post) => {
            this.userService.getUserById({ id: post.userId }).subscribe({
              next: (user) => {
                console.log('Utilisateur récupéré pour le post ID', post.id, ':', user);
                post.user = user; // Ajouter l'objet user directement au post
              },
              error: (err) => {
                console.error('Erreur lors de la récupération de l’utilisateur pour le post', post.id, err);
              }
            });
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des posts utilisateur :', error);
        this.isLoading = false;
      }
    });
  }
  

  
 
  onEdit(post: Post) {
    this.selectedPostToEdit = { ...post };
    this.showEditModal = true;
  }

  onEditImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPostToEdit = null;
    this.selectedFile = null;
  }

  submitEdit() {
    if (this.selectedPostToEdit) {
      const formData = new FormData();
      formData.append('title', this.selectedPostToEdit.title || '');
      formData.append('content', this.selectedPostToEdit.content || '');
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      this.bs.updatePost(this.selectedPostToEdit.id, this.userId, formData).subscribe({
        next: (updatedPost) => {
          console.log('Post updated successfully', updatedPost);
          this.toastr.success('Post updated successfully!', 'Success');
          this.fetchUserPosts();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Error updating post', err);
          this.toastr.error('Failed to update post', 'Error');
        }
      });
    }
  }
  onDelete(postId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action supprimera le post et tous ses commentaires.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Étape 1 : Supprimer les commentaires
        this.bs.deleteCommentsByPostId(postId).subscribe({
          next: () => {
            // Étape 2 : Supprimer le post une fois les commentaires supprimés
            this.bs.DeletePost(postId).subscribe({
              next: () => {
                this.toastr.success('Post supprimé avec succès', 'Succès');
                Swal.fire('Supprimé !', 'Le post et ses commentaires ont été supprimés.', 'success');
                this.fetchUserPosts(); // rechargement de la liste
              },
              error: (err) => {
                console.error('Erreur suppression du post:', err);
                Swal.fire('Erreur', 'Impossible de supprimer le post.', 'error');
              }
            });
          },
          error: (err) => {
            console.error('Erreur suppression des commentaires:', err);
            Swal.fire('Erreur', 'Impossible de supprimer les commentaires.', 'error');
          }
        });
      }
    });
  }

  toggleMenu(postId: number) {
    this.openMenuId = this.openMenuId === postId ? null : postId;
  }

  goBack(): void {
    this.location.back();
  }
}
