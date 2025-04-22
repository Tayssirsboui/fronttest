import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostRecommendationService } from 'src/app/services/post-recommendation.service';

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
  imageError: string | null = null;
  selectedImage: File | null = null;
  selectedFile: File | null = null;
  post!: Post;

  // Pagination properties
  currentPage: number = 1;
  postsPerPage: number = 4;
  totalPosts: number = 0;
  totalPages: number = 0;
  paginatedPosts: Post[] = [];
  previousSearchTerm: string = '';
  postForm: FormGroup;
  recommendations: Post[] = [];
  id!: number;
  recommendationError: string | null = null;
  isLoading = false;
  isRecommendationMode = false;
  showRecommendationForm = false;
  moodInput = '';
  filteredActivities: Post[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private bs: BlogService,
    private fb: FormBuilder,
    public toastr: ToastrService,
    private router: Router,
    private act: ActivatedRoute,
    private location: Location,
    private postRecommendationService: PostRecommendationService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      userId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      createdBy: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.act.snapshot.params['id'];
    if (this.id) {
      this.bs.getPostsById(this.id).subscribe((data) => {
        this.post = data;
        console.log(this.post);
        this.postForm.patchValue(this.post);
      });
    }

    this.toastr.info("Les posts disponibles dans Genius", "Info");
    this.loadPosts();

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        if (searchTerm.length >= 3) {
          this.isLoading = true;
          return this.postRecommendationService.recommendActivities(searchTerm);
        } else {
          return new Observable<Post[]>(observer => observer.next([]));
        }
      })
    ).subscribe({
      next: (recommendedPosts) => {
        this.recommendations = recommendedPosts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching recommendations:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchInput(event: Event) {
    const input = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchTerm = input;
    this.searchSubject.next(input);
  }

  toggleRecommendationForm(): void {
    this.showRecommendationForm = !this.showRecommendationForm;
    if (!this.showRecommendationForm) {
      this.resetRecommendations();
    }
  }

  getRecommendations(): void {
    if (!this.moodInput.trim()) {
      this.recommendationError = 'Veuillez décrire ce que vous recherchez';
      return;
    }

    this.isLoading = true;
    this.recommendationError = null;
    this.showRecommendationForm = true;

    this.postRecommendationService.recommendFromAllActivities(this.moodInput).subscribe({
      next: (recommendations) => {
        this.filteredActivities = recommendations.filter(post => (post.similarity ?? 0) > 0.25);
        this.isRecommendationMode = true;
        this.isLoading = false;
        
        if (this.filteredActivities.length === 0) {
          this.recommendationError = 'Aucun post correspondant trouvé. Essayez avec d\'autres mots-clés.';
        }
      },
      error: (err) => {
        console.error('Recommendation failed:', err);
        this.recommendationError = 'Impossible d\'obtenir des recommandations. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  resetRecommendations(): void {
    this.filteredActivities = [...this.listPosts];
    this.isRecommendationMode = false;
    this.moodInput = '';
    this.recommendationError = null;
  }
    fetchRecommendations(userPost: string): void {
      this.bs.getPosts().subscribe((existingPosts: Post[]) => {
        this.postRecommendationService.recommendFromAllActivities(userPost).subscribe(
          (recommendedPosts) => {
            console.log('Recommended Posts:', recommendedPosts);  // Debug: Voir la réponse
            this.recommendations = recommendedPosts;
          },
          (error) => {
            console.error('Error fetching recommendations:', error);
            // Gérer l'erreur
          }
        );
      });
    }
  //trier les posts par date de création
  sortByDate(order: string): void {
    if (order === 'latest') {
      this.paginatedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === 'oldest') {
      this.paginatedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  }
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Vérifiez le type de fichier
      if (!file.type.match('image.*')) {
        this.imageError = 'Seules les images sont acceptées';
        this.selectedFile = null;
        return;
      }
      
      this.imageError = null;
      this.selectedFile = file;
    }
  }
  addPosts() {
    // Vérifiez d'abord la validité du formulaire
    this.toastr.info('Début de addPosts', 'Test');
    if (this.postForm.invalid) {
      this.toastr.warning('Veuillez remplir tous les champs correctement', 'Formulaire invalide');
      return;
    }
  
    const formData = new FormData();
    
    // Ajoutez tous les champs au FormData
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('description', this.postForm.get('content')?.value);
    formData.append('userId', this.postForm.get('userId')?.value);
    formData.append('createdBy', this.postForm.get('createdBy')?.value);
  
    // Gestion du fichier image
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    } else {
      this.toastr.warning('Veuillez sélectionner une image', 'Champ requis');
      return;
    }
  
    // Envoi des données
    this.bs.addPostWithImage(formData).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response); // Ajout du log
        this.toastr.success('Post créé avec succès', 'Succès');
        this.closeModal();
        this.loadPosts(); // Rechargez les posts après ajout
        
        // Réinitialisez le formulaire
        this.postForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Erreur lors de la création du post:', err); // Log de l'erreur
        this.toastr.error('Erreur lors de la création du post', 'Erreur');
      }
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
  // ngOnInit() {
  //   this.id=this.act.snapshot.params['id']
  //   this.bs.getPostsById(this.id).subscribe(
  //     (data)=> {
  //       this.post=data,
  //       console.log(this.post)
  //       //3- initialiser le formulaire
  //       this.postForm.patchValue(this.post)

  //     }
  //   )
  //   this.toastr.info("les posts disponibles dans genuis ", "Info");
  //   this.loadPosts();
  // } 

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
// onSearchInput(event: Event): void {
//   const input = event.target as HTMLInputElement;
//   this.searchSubject.next(input.value.trim().toLowerCase());
// }

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
}