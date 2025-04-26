// blog.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { Post } from 'src/app/models/post';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  activeCardId: number | null = null;
  listPosts: Post[] = [];
  paginatedPosts: Post[] = [];
  userId: number = 1;
  showModal = false;
  selectedPostId: number | null = null;
  currentPage = 1;
  postsPerPage = 4;
  totalPages = 0;
  totalPosts = 0;
  previousSearchTerm = '';
  postForm: FormGroup;
  private _searchTerm: string = '';
  private searchSubject = new Subject<string>();
  showLView: { [key: number]: boolean } = {};
  userInput = '';
  recommendedPosts: any[] = [];
  selectedFile: File | null = null;
style: any;
showSortOptions = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private bs: BlogService,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
     // createdBy: ['', Validators.required]
    });
  }
  

  ngOnInit() {
    this.toastr.info("Chargement des posts", "Info");
    this.loadPosts();
  }

  loadPosts() {
    this.bs.getPosts().subscribe(data => {
      this.listPosts = data;
      this.totalPosts = data.length;
      this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
      this.updatePaginatedPosts();
      this.loadCommentsCount();
    });
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    if (this._searchTerm !== value) {
      this._searchTerm = value;
      this.currentPage = 1;
      this.updatePaginatedPosts();
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim().toLowerCase());
  }

  get filteredPosts(): Post[] {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      return this.listPosts;
    }
    return this.listPosts.filter(p =>
      (p.title && p.title.toLowerCase().includes(this.searchTerm)) ||
      (p.content && p.content.toLowerCase().includes(this.searchTerm)) ||
      (p.createdBy && p.createdBy.toLowerCase().includes(this.searchTerm))
    );
  }

  updatePaginatedPosts() {
    const filtered = this.filteredPosts;
    this.totalPosts = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalPosts / this.postsPerPage));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    this.paginatedPosts = filtered.slice(startIndex, startIndex + this.postsPerPage);
    this.loadCommentsCount();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedPosts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }
   // Méthode pour basculer l'affichage des options de tri
   toggleSortOptions() {
    this.showSortOptions = !this.showSortOptions;
  }

  sortByDate(order: string): void {
    if (!this.listPosts) return; // Sécurité
  
    if (order === 'latest') {
      this.listPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === 'oldest') {
      this.listPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  
    // Après tri, il faut mettre à jour la pagination
    this.updatePaginatedPosts();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Fichier chargé :', file);
    }
  } 
 
  
  loadCommentsCount(): void {
    this.paginatedPosts.forEach(post => {
      this.bs.getcommentsByPostId(post.id).subscribe(comments => {
        post.commentsCount = comments.length;
      });
    });
  }
  addPosts() {
    const formData = new FormData();
    formData.append('title', this.postForm.value.title);
    formData.append('description', this.postForm.value.content);
    //formData.append('createdBy', this.postForm.value.createdBy);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile); // ✅ le backend attend bien "image"
    } else {
      this.toastr.error("Veuillez sélectionner une image.", "Image manquante");
      return; // stop ici si pas d’image
    }
  
    this.bs.addPost(formData, this.userId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Le post a été ajouté avec succès !',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          this.loadPosts();
          this.postForm.reset();
          this.selectedFile = null;
          this.toastr.success('Le post a été ajouté avec succès', 'Succès');
        this.router.navigate(['/blogs']);
        });
      },
      error: (err) => {
        this.toastr.error("Échec de l'ajout du post", 'Erreur');
        console.error(err);
      }
    });
  }
  
  




  

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  toggleCard(id: number) {
    this.activeCardId = this.activeCardId === id ? null : id;
  }

  toggleView(id: number) {
    this.showLView[id] = !this.showLView[id];
  }

  confirmDelete(id: number) {
    this.selectedPostId = id;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal')!);
    modal.show();
  }

  deletePost() {
    if (this.selectedPostId !== null) {
      this.bs.DeletePost(this.selectedPostId).subscribe({
        next: () => {
          this.loadPosts();
          const modalElement = document.getElementById('confirmDeleteModal');
          if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal?.hide();
          }
          this.toastr.success('Le post a été supprimé avec succès', 'Succès');
        },
        error: () => {
          this.toastr.error('Erreur lors de la suppression du post', 'Erreur');
        }
      });
    }
  }
  searchRecommendations() {
    if (this.userInput.trim()) {
      this.bs.getRecommendedPosts(this.userInput).subscribe({
        next: (posts) => {
          this.recommendedPosts = posts;
          console.log("Recommended posts:", this.recommendedPosts);
        },
        error: (err) => {
          console.error('Error fetching recommendations:', err);
        }
      });
    }
  }
  
  goBack() {
    this.location.back();
  }
}
