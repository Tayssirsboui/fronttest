import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { PostService } from 'src/app/services/post.service';

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
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce post signalé ?',
      accept: () => {
        this.postService.deletePost(id).subscribe({
          next: () => {
            this.posts = this.posts.filter(p => p.id !== id);
            this.updateFilteredPosts();
          },
          error: (err) => console.error('Erreur lors de la suppression du post', err)
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
