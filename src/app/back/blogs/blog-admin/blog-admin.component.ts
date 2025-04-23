import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment';

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
    private router: Router, private Ac: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  // Open the comments modal and load the comments for the selected post
  openCommentsModal(postId: number): void {
    this.loadingComments = true;
    this.comments = []; // Clear any previously loaded comments

    this.postId = postId;

    // Fetch the post data
    this.blogService.getPostsById(postId).subscribe({
      next: (data) => {
        this.post = data; // Set the post data
      },
      error: (err) => {
        console.error('Error loading post', err);
        this.loadingComments = false;
      }
    });

    this.blogService.getcommentsByPostId(postId).subscribe((data: any) => {
      this.comments = data as Comment[];
      const commentsCount = data.length;
      this.loadingComments = false;
      this.showModal = true; // Show the modal

      if (this.post) {
        this.post.commentsCount = commentsCount;
      }
    });
  }

  // Close the modal when clicking outside
  closeModal(): void {
    this.showModal = false;
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
