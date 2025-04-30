import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from 'src/app/models/comment';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { UserControllerService } from 'src/app/services/services';

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
  noCommentsPopup: boolean = false;
  userData: any;
  userId: any;
  userNames: any;
  userEmail: any;
  constructor(
    private blogService: BlogService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private Ac: ActivatedRoute, private userService: UserControllerService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }
  sortAsc: boolean = false;

toggleSortOrder(): void {
  this.sortAsc = !this.sortAsc;
  this.sortPostsByDate();
}

sortPostsByDate(): void {
  this.posts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return this.sortAsc ? dateA - dateB : dateB - dateA;
  });
}
  // Chart configuration
  showStats: boolean = false;
  searchTerm: string = '';

  get filteredPosts() {
    return this.posts.filter(p =>
      p.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.content?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.createdBy?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  get paginatedPosts(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPosts.slice(start, end);
  }
  
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
        // Si aucun commentaire n'est trouvé, afficher la popup
        console.error('No comments found for this post');
        this.loadingComments = false;
        this.noCommentsPopup = true; // Afficher la popup
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
  // deletePost(postId: number): void {
  //   if (confirm('Are you sure you want to delete this post?')) {
  //     this.blogService.DeletePost(postId).subscribe({
  //       next: () => {
  //         this.toastr.success('Post deleted successfully', 'Success');
  //         this.loadPosts();
  //       },
  //       error: (err) => {
  //         this.toastr.error('Failed to delete post', 'Error');
  //       }
  //     });
  //   }
  // }
  deletePost(post: any): void {
    if (confirm('Are you sure you want to delete this post?')) {
      const { id, title, userId } = post;
      const author = this.userNames.get(userId) || '';
      const email = this.userEmail.get(userId) || '';
  
      // Mise à jour de l'état local
      this.posts = this.posts.filter(p => p.id !== id);
   
  
      // Appel au backend
      this.blogService.deletePost(id, title, author, email).subscribe({
        next: () => {
          this.toastr.success('Post deleted and email sent', 'Success');
        },
        error: err => {
          console.error('Failed to delete post:', err);
          this.toastr.error('Failed to delete post', 'Error');
        }
      });
    }
  }
  

  ngOnInit(): void {
    this.loadPosts();
    this.loadUserData(); 
  }
  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;  
        this.userId = payload.id || payload.userId || payload._id; // selon ton token
        console.log("Utilisateur connecté :", this.userData);
      }
    } else {
      console.error('Token non trouvé dans localStorage');
      this.toastr.error('Utilisateur non connecté', 'Erreur');
    }
  }
  
    private decodeTokenPayload(token: string): any {
      try {
        const payload = token.split('.')[1]; // prendre la partie payload du JWT
        const decodedPayload = atob(payload); // décoder base64
        return JSON.parse(decodedPayload); // convertir en objet JSON
      } catch (error) {
        console.error('Failed to decode token payload', error);
        return null;
      }
    }
  // loadPosts(): void {
  //   this.isLoading = true;
  //   this.blogService.getPosts().subscribe({
  //     next: (posts: Post[]) => {
  //       this.posts = posts;
  //       this.totalPosts = posts.length;
  //       this.sortPostsByDate(); // <-- ici
  //       this.isLoading = false;
  //       this.posts.forEach(post => {
  //         if (post.userId) {
  //           this.userService.getUserById({ id: post.userId }).subscribe(user => {
  //             console.log('User récupéré pour post ID', post.id, ':', user); // <-- Ajoute un log ici
  //             post.user = user;
  //           }, error => {
  //             console.error('Erreur récupération user pour post', post.id, error); // <-- Et un log d'erreur
  //           });
  //         }
  //       });
  //  } })

  // }
  loadPosts(): void {
    this.isLoading = true;
  
    this.blogService.getPosts().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        this.totalPosts = posts.length;
        this.sortPostsByDate(); // Sort if needed
        this.isLoading = false;
  
        // Fetch user data for each post
        this.posts.forEach(post => {
          if (post.userId) {
            this.userService.getUserById({ id: post.userId }).subscribe({
              next: user => {
                post.user = user;
            
              },
              error: err => {
                console.error(`Error fetching user for post ID ${post.id}:`, err);
                //post.user = { name: 'Unknown User' }; // Fallback
              }
            });
          }
        });
      },
      error: err => {
        this.toastr.error('Failed to load posts', 'Error');
        this.isLoading = false;
      }
    });
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
  downloadPageAsPNG(event: Event): void {
    event.preventDefault();
    const pageElement = document.getElementById('admin-page'); // ID de l'élément à capturer
    if (pageElement) {
      html2canvas(pageElement, {
        useCORS: true, // Permet d'inclure les images distantes si elles sont accessibles
        logging: true,  // Active les logs pour le débogage
       // proxy: 'https://your-proxy-server.com/', // Optionnel, si nécessaire pour contourner les restrictions CORS
        scale: 4     // Améliore la qualité de l'image (facultatif, selon vos besoins)
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'admin-page.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(error => {
        console.error("Error capturing page as PNG: ", error);
      });
    } else {
      console.error("Element with id 'admin-page' not found.");
    }
  
  }

  downloadPageAsJPEG(event: Event): void {
    event.preventDefault();
    const pageElement = document.getElementById('admin-page');
    if (pageElement) {
      html2canvas(pageElement).then(canvas => {
        const link = document.createElement('a');
        link.download = 'admin-page.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      });
    }
  }

  downloadPageAsPDF(event: Event): void {
    event.preventDefault();
    const pageElement = document.getElementById('admin-page'); // ID de l'élément à capturer
    if (pageElement) {
      html2canvas(pageElement, {
        useCORS: true, // Permet d'inclure les images distantes
        logging: true,  // Active les logs pour le débogage
       // proxy: 'https://your-proxy-server.com/', // Optionnel, si nécessaire pour contourner les restrictions CORS
        scale: 4      // Améliore la qualité de l'image (facultatif)
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');  // Utilisation du format paysage
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('admin-page.pdf');
      }).catch(error => {
        console.error("Error capturing page as PDF: ", error);
      });
    } else {
      console.error("Element with id 'admin-page' not found.");
    }
  }


  downloadPageAsCSV(event: Event): void {
    event.preventDefault();
    const headers = ['Id', 'Title', 'Author', 'Likes', 'Date'];
    const data = this.posts.map(post => ({
      Id: post.id,
      Title: post.title,
      Author: post.createdBy,
      Likes: post.likes,
      Date: post.createdAt
    }));

    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += `${row.Id},${row.Title},${row.Author},${row.Likes},${row.Date}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'admin-page-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
