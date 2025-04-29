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
import { UserService } from 'src/app/services/user.service';
import { UserControllerService } from 'src/app/services/services';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  activeCardId: number | null = null;
  listPosts: Post[] = [];
  paginatedPosts: Post[] = [];
  userId!: number ;
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
user: any;
userName!:string;

userEmail!:string;

showSortOptions = false;
  userData: any;

  sortCriterion: 'date' | 'comments' | 'oldest' = 'date';
  selectedSortLabel = 'Trier';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private bs: BlogService,
    private toastr: ToastrService,
    private userService: UserControllerService,
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
    this.loadUserData(); 
    this.scrollToTop();
    
  }

  
  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  loadPosts() {
    this.bs.getPosts().subscribe(data => {
      this.listPosts = data;
      this.totalPosts = data.length;
      this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
   
      this.listPosts.forEach(post => {
        if (post.userId) {
          this.userService.getUserById({ id: post.userId }).subscribe(user => {
            console.log('User récupéré pour post ID', post.id, ':', user); // <-- Ajoute un log ici
            post.user = user;
          }, error => {
            console.error('Erreur récupération user pour post', post.id, error); // <-- Et un log d'erreur
          });
        }
      });

      this.updatePaginatedPosts();
      this.loadCommentsCount();
    }, error => {
      console.error('Erreur récupération posts', error);
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
    let filtered = this.filteredPosts;
  
    // Appliquer le tri selon le critère choisi
    if (this.sortCriterion === 'date') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (this.sortCriterion === 'oldest') {
      filtered = filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (this.sortCriterion === 'comments') {
      filtered = filtered.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0));
    }
  
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
  
  sortByRecentDate(): void {
    this.sortCriterion = 'date'; // <-- AJOUTÉ
    this.selectedSortLabel = 'Les plus récents';
    this.updatePaginatedPosts(); // laisse Angular gérer le tri ici
  } 
  sortByOldestDate(): void {
    this.sortCriterion = 'oldest'; // <-- AJOUTÉ
    this.selectedSortLabel = 'Les plus anciens';
    this.updatePaginatedPosts(); // laisse Angular gérer le tri ici
  }
  
  sortByComments(): void {
    this.sortCriterion = 'comments'; // <-- AJOUTÉ
    this.selectedSortLabel = 'Les plus commentés';
    this.updatePaginatedPosts(); // laisse Angular gérer le tri ici
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
   
      if (!this.userId) {
        this.toastr.error("Utilisateur non connecté.", "Erreur");
        return;
      }

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
          text: 'The post has been successfully added! 📢',
          confirmButtonText: 'OK',
          timer: 2000,
          timerProgressBar: true,
          allowOutsideClick: false, // (optionnel) empêcher de cliquer dehors pour fermer
           allowEscapeKey: false,    
        }).then(() => {
          this.loadPosts();
          this.postForm.reset();
          this.selectedFile = null;
          this.closeModal(); 
          this.toastr.success('The post has been successfully added!', 'Succès');
        this.router.navigate(['blogs']);
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
