import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mes-posts',
  templateUrl: './mes-posts.component.html',
  styleUrls: ['./mes-posts.component.css']
})
export class MesPostsComponent implements OnInit {
  userPosts: Post[] = [];
  userId: number = 1; // Replace with dynamic user ID if needed
  isLoading = false;
  selectedPostToEdit: Post | null = null;
showEditModal: boolean = false;


  selectedFile: File | null = null;


  constructor(private bs: BlogService,private location: Location) {}

  ngOnInit(): void {
    this.fetchUserPosts();
  }
  onEdit(post: Post) {
    this.selectedPostToEdit = { ...post }; // clone l'objet pour éviter la modification directe
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
          console.log('Post modifié avec succès', updatedPost);
          this.fetchUserPosts();
          this.closeEditModal();
        },
        error: (err) => {
          console.error('Erreur lors de la modification du post', err);
        }
      });
    }
  }

  




  
  fetchUserPosts(): void {
    this.isLoading = true;
    this.bs.getPostsByUserId(this.userId).subscribe(
      (posts) => {
        this.userPosts = posts;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading user posts:', error);
        this.isLoading = false;
      }
    );
  }
  openMenuId: number | null = null;

toggleMenu(postId: number) {
  this.openMenuId = this.openMenuId === postId ? null : postId;
}




onDelete(postId: number): void {
  if (confirm("Voulez-vous vraiment supprimer ce post ?")) {
    this.bs.DeletePost(postId).subscribe(
      () => {
        console.log('Post supprimé avec succès');
       
          this.fetchUserPosts(); 
      },
      error => {
        console.error('Erreur lors de la suppression du post:', error);
      }
    );
  }
}


goBack(): void {
  this.location.back();
}

}
