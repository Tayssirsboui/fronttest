import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
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
      },
      error: (error) => {
        console.error('Error loading user posts:', error);
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
    if (confirm('Are you sure you want to delete this post?')) {
      this.bs.DeletePost(postId).subscribe({
        next: () => {
          console.log('Post deleted successfully');
          this.toastr.success('Post deleted successfully', 'Success');
          this.fetchUserPosts();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.toastr.error('Failed to delete post', 'Error');
        }
      });
    }
  }

  toggleMenu(postId: number) {
    this.openMenuId = this.openMenuId === postId ? null : postId;
  }

  goBack(): void {
    this.location.back();
  }
}
