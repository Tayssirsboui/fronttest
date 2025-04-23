import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-mes-posts',
  templateUrl: './mes-posts.component.html',
  styleUrls: ['./mes-posts.component.css']
})
export class MesPostsComponent implements OnInit {
  userPosts: Post[] = [];
  userId: number = 1; // Replace with dynamic user ID if needed
  isLoading = false;

  constructor(private bs: BlogService) {}

  ngOnInit(): void {
    this.fetchUserPosts();
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

onEdit(post: Post) {
  console.log('Modifier', post);
  // Add your navigation or modal logic here
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




}
