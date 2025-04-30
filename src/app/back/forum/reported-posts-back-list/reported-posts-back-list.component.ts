import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { PostService } from 'src/app/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reported-posts-back-list',
  templateUrl: './reported-posts-back-list.component.html',
  styleUrls: ['./reported-posts-back-list.component.css']
})
export class ReportedPostsBackListComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 8;
  totalPosts: number = 0;

  constructor(
    private postService: PostService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.postService.getReportedPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.totalPosts = data.length;
        this.updateFilteredPosts();
      },
      error: (err) => console.error('Erreur de récupération des posts signalés', err)
    });
  }

  updateFilteredPosts(): void {
    let postsToDisplay = this.posts;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      postsToDisplay = this.posts.filter(p =>
        p.content.toLowerCase().includes(term)
      );
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.filteredPosts = postsToDisplay.slice(start, end);
    this.totalPosts = postsToDisplay.length;
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updateFilteredPosts();
  }

  deletePost(id: number) {
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== id);
        this.updateFilteredPosts();
  
        Swal.fire({
          icon: 'success',
          title: 'Post supprimé',
          text: 'Le post signalé a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du post', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La suppression du post a échoué.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.updateFilteredPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredPosts();
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalPosts / this.pageSize);
  }
}
