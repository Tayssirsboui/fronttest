import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  activeCardId: number | null = null;
  listPosts!: Post[];
  userId: number = 1;
  message: string = '';
  level: string = '';
  selectedPostId: number | null = null;
  showLView: { [key: number]: boolean } = {};
  showModal = false;

  // Pagination properties
  currentPage: number = 1;
  postsPerPage: number = 4;
  totalPosts: number = 0;
  totalPages: number = 0;
  paginatedPosts: Post[] = [];
  previousSearchTerm: string = ''; 
   postForm: FormGroup;
  
   id!: number;


  constructor(private bs: BlogService,    private fb: FormBuilder,
   private toastr: ToastrService,private router: Router,private location: Location)  {
      this.postForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        content: ['', [Validators.required, Validators.minLength(10)]],
        image: [''],
        userId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        createdBy: ['', Validators.required]
      });
    }
  //trier les posts par date de création
  sortByDate(order: string): void {
    if (order === 'latest') {
      this.paginatedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === 'oldest') {
      this.paginatedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  }addPosts() {
    const postData = {
      ...this.postForm.value,
      postId: this.id, // Assurez-vous que 'this.id' est défini et contient l'ID du post
      userId: this.userId // Assurez-vous que 'this.userId' contient l'ID de l'utilisateur connecté
    };
    if (this.id) {
      this.bs.updatePost(this.id, this.userId,postData).subscribe(() => {
        this.router.navigateByUrl('/blog-details/' + this.id);
      });
    } else {
      // Create
      this.bs.addPost(this.postForm.value).subscribe(() => {
        this.router.navigateByUrl('/blog');
      });
    }
    this.bs.postToFacebook("Bonjour depuis Angular + Spring Boot !")
  .subscribe({
    next: () => alert("Message publié sur Facebook !"),
    error: err => alert("Erreur de publication : " + err.error.message)
  });

  }

  openModal() {
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }
  
 
  //methodes pour calculer le nombre de commentaires
  loadCommentsCount(): void {
    this.paginatedPosts.forEach(post => {
      this.bs.getcommentsByPostId(post.id).subscribe(comments => {
        post.commentsCount = comments.length;
      });
    });}
   // Modifiez la fonction onSearchChange comme ceci
   onSearchChange() {
    // Ne réinitialisez la page que si le terme de recherche a vraiment changé
    if (this.searchTerm.trim() !== this.previousSearchTerm) {
      this.currentPage = 1;
      this.previousSearchTerm = this.searchTerm.trim();
    }
    this.updatePaginatedPosts();
  }

  // Ajoutez cette propriété pour suivre le terme de recherche précédent
  ngOnInit() {
    this.toastr.info("les posts disponibles dans genuis ", "Info");
    this.loadPosts();
  }

  loadPosts() {
    this.bs.getPosts().subscribe((data) => {
      this.listPosts = data;
      this.totalPosts = data.length;
      this.totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
      this.updatePaginatedPosts();
      this.loadCommentsCount();
      
    });
  }

   // Modifiez votre getter filteredPosts comme ceci
  //    

//pagiantion 
private _searchTerm: string = '';

get searchTerm(): string {
  return this._searchTerm;
}

set searchTerm(value: string) {
  if (this._searchTerm !== value) {
    this._searchTerm = value;
    this.currentPage = 1; // Réinitialise seulement quand le terme change
    this.updatePaginatedPosts();
  }
}
private searchSubject = new Subject<string>();
onSearchInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.searchSubject.next(input.value.trim().toLowerCase());
}

get filteredPosts(): Post[] {
  if (!this.searchTerm || this.searchTerm.trim() === '') {
    return this.listPosts || [];
  }
  return (this.listPosts || []).filter(p => 
    (p.title && p.title.toLowerCase().includes(this.searchTerm)) ||
    (p.content && p.content.toLowerCase().includes(this.searchTerm)) ||
    (p.createdBy && p.createdBy.toLowerCase().includes(this.searchTerm))
  );
}
  // Modifiez updatePaginatedPosts pour une meilleure stabilité
  updatePaginatedPosts() {
    const filtered = this.filteredPosts;
    this.totalPosts = filtered.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalPosts / this.postsPerPage));
    
    // Gardez la page actuelle si possible, sinon ajustez
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    this.paginatedPosts = filtered.slice(startIndex, startIndex + this.postsPerPage);
    this.loadCommentsCount();
  }
  

  // Pagination navigation methods
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

  // Other existing methods...
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
    this.message = '';
    this.level = 'success';

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
        error: (error) => {
          this.level = 'danger';
          this.message = 'Error deleting post!';
          this.toastr.error(this.message, 'Erreur');
        }
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  goBack(): void {
    this.location.back();
  }
  recommendedPosts: any[] = [];
  searchQuery: string = '';
  onSearch(): void {
    if (this.searchQuery.trim() !== '') {
      this.bs.getRecommendedPosts(this.searchQuery)
        .subscribe({
          next: (posts) => this.recommendedPosts = posts,
          error: (err) => console.error('Erreur de recommandation', err)
        });
    } else {
      this.recommendedPosts = [];
    }
  }
}