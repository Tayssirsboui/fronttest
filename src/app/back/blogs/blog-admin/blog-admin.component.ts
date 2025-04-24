import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-blog-admin',
  templateUrl: './blog-admin.component.html',
  styleUrls: ['./blog-admin.component.css']
})
export class BlogAdminComponent implements OnInit {
  
  posts: Post[] = [];
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 10;
  totalPosts = 0;
  searchForm: FormGroup;
  Math = Math;
  comments: Comment[] = [];
  loadingComments = false;
  postId!: number;
  post: Post | null = null;
  showModal: boolean = false;

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private Ac: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }
  // Chart configuration
  showStats: boolean = false;

toggleStats(): void {
  this.showStats = !this.showStats;
}

showStatsModal: boolean = false;

openStatsModal(): void {
  this.showStatsModal = true;
}

closeStatsModal(): void {
  this.showStatsModal = false;
}

  showConfirmModal = false;
  confirmType: 'post' | 'comment' = 'post';
  itemIdToDelete: number | null = null;
  

  openConfirmModal(type: 'post' | 'comment', id: number): void {
    this.confirmType = type;
    this.itemIdToDelete = id;
    this.showConfirmModal = true;
  }
  
  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.itemIdToDelete = null;
  }
  
  confirmDeletion(): void {
    if (this.confirmType === 'post' && this.itemIdToDelete !== null) {
      this.blogService.DeletePost(this.itemIdToDelete).subscribe({
        next: () => {
          this.toastr.success('Post deleted successfully', 'Success');
          this.loadPosts();
        },
        error: () => {
          this.toastr.error('Failed to delete post', 'Error');
        },
        complete: () => this.closeConfirmModal()
      });
    } else if (this.confirmType === 'comment' && this.itemIdToDelete !== null) {
      this.blogService.deleteComment(this.itemIdToDelete).subscribe({
        next: () => {
          this.toastr.success('Comment deleted successfully', 'Success');
          this.comments = this.comments.filter(c => c.idComment !== this.itemIdToDelete);
        },
        error: () => {
          this.toastr.error('Failed to delete comment', 'Error');
        },
        complete: () => this.closeConfirmModal()
      });
    }
  }
  
  // Open the comments modal and load the comments for the selected post
  openCommentsModal(postId: number): void {
    this.loadingComments = true;
    this.comments = []; // Clear any previously loaded comments
  
    this.postId = postId;
  
    // Load post data
    this.blogService.getPostsById(postId).subscribe({
      next: (data) => {
        this.post = data; // Set the post data
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.loadingComments = false;
      }
    });
  
    // Fetch comments for the post
    this.blogService.getcommentsByPostId(postId).subscribe((data: any) => {
      console.log('Fetched comments:', data); // Log the full response

      if (data && data.length > 0) {
        this.comments = data as Comment[];

        // Log each comment's id to verify it's being fetched properly
        this.comments.forEach(comment => {
          console.log('Comment ID:', comment.idComment); // Ensure the id is present
        });

        const commentsCount = data.length;
        this.loadingComments = false;
        this.showModal = true; // Show the modal

        if (this.post) {
          this.post.commentsCount = commentsCount;
        }
      } else {
        console.error('No comments found or structure is incorrect');
        this.loadingComments = false;
      }
    });
  }
  
  // Close the modal when clicking outside
  closeModal(): void {
    this.showModal = false;
  }
  deleteComment(commentId: number): void {
    console.log('Deleting comment with ID:', commentId); // Log to check commentId
    
    // Validate commentId before attempting to delete
    if (commentId && commentId !== undefined && commentId !== null) {
      this.blogService.deleteComment(commentId).subscribe({
        next: () => {
          this.toastr.success('Comment deleted successfully', 'Success');
          // Remove the deleted comment from the comments array by using idComment
          this.comments = this.comments.filter(comment => comment.idComment !== commentId);
        },
        error: (err: any) => {
          this.toastr.error('Failed to delete comment', 'Error');
          console.error('Error:', err);
        }
      });
    } else {
      console.error('Invalid commentId:', commentId); // Log invalid commentId
    }
  }
  
  

  // Delete post
  deletePost(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.DeletePost(postId).subscribe({
        next: () => {
          this.toastr.success('Post deleted successfully', 'Success');
          this.loadPosts();
        },
        error: (err) => {
          this.toastr.error('Failed to delete post', 'Error');
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.blogService.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.totalPosts = posts.length;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load posts', 'Error');
        this.isLoading = false;
      }
    });
  }

  get paginatedPosts(): Post[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.posts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalPosts / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  editPost(postId: number): void {
    this.router.navigate(['/admin/blog/edit', postId]);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  searchPosts(): void {
    const query = this.searchForm.get('searchQuery')?.value.toLowerCase();
    if (!query) {
      this.loadPosts();
      return;
    }

    this.posts = this.posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
    this.totalPosts = this.posts.length;
    this.currentPage = 1;
  }
}
