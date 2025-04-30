import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';
import { PostService } from 'src/app/services/post.service';
import { CommunityWithPostsDTO } from 'src/app/models/community.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-community-detail',
  templateUrl: './community-detail.component.html',
  styleUrls: ['./community-detail.component.css']
})
export class CommunityDetailComponent implements OnInit{
  communityId!: number;
  community: any;
  posts: any[] = [];
  joined = false;
  newPostContent = '';
  communityDetails: CommunityWithPostsDTO | null = null;
  currentPage: number = 1;
postsPerPage: number = 5;
sortOrder: 'asc' | 'desc' = 'desc'; // Ajouté : ordre de tri par défaut (plus récents d'abord)
  userData: any;
  userId: any;
  userCommunities: any[] = [];
  isLoading: boolean = false; // Pour gérer le chargement
  generatedPost: string | null = null; // Pour stocker le message généré
  showConfirmation: boolean = false; // Pour afficher la fenêtre de confirmation
  fullName: string = '';
  userImage: string = '';
  



  constructor(
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private postService: PostService,
    private router: Router  // Injecte le Router ici

  ) {}

  ngOnInit(): void {
    // Récupère l'ID de la communauté depuis les paramètres d'URL
    this.communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUserData();  
    if (this.userId) {
      this.communityService.getCommunitiesByUser(this.userId).subscribe({
        next: (userCommunities) => {
          this.userCommunities = userCommunities;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des communautés de l\'utilisateur', err);
        }
      });
    }  
    // Appel au service pour récupérer les détails de la communauté
    this.communityService.getCommunityWithPosts(this.communityId).subscribe(
      data => {
        this.communityDetails = data;
        
        
      },
      error => {
        console.error('Erreur lors de la récupération de la communauté', error);
      }
    );
  }

  loadData() {
    this.communityService.getCommunity(this.communityId).subscribe(data => this.community = data);
    this.communityService.getPosts(this.communityId).subscribe(data => this.posts = data);
  }

  join() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.communityService.joinCommunity(this.communityId, user.id).subscribe(() => this.joined = true);
    console.log('Rejoint la communauté avec ID :', this.communityId);

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
  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        this.userId = payload.id || payload.userId || payload._id; // selon ton token
        this.fullName = payload.name || payload.fullName || '';      // ✅ Ajout du nom
        this.userImage = payload.image || payload.profileImage || ''; // ✅ Ajout de l'image
        console.log("Utilisateur connecté :", this.userData);
      }
    } else {
      console.error('Token non trouvé dans localStorage');
      //this.toastr.error('Utilisateur non connecté', 'Erreur');
    }
  }
  createPost() {
    const user = JSON.parse(localStorage.getItem('user')!);
  const post = {
    content: this.newPostContent,
    communityId: this.communityId,
    fullName: user.name,
    userImage: user.image
    
  };
    this.postService.createPost(this.communityId,post,this.userId).subscribe(() => {
      this.newPostContent = '';
      this.loadData();
    });
  }
  goHome() {
    this.router.navigate(['communities']); // Redirection vers la page d'accueil
  }

  goToCreatePost() {
    this.router.navigate([`/community`, this.communityId, 'create-post']);
  }
  
  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.postsPerPage;
    return this.communityDetails?.posts.slice(start, start + this.postsPerPage);
  }
  
  get totalPages(): number {
    return this.communityDetails ? Math.ceil(this.communityDetails.posts.length / this.postsPerPage) : 0;
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
  deletePost(postId: number) {
    this.postService.deletePost(postId).subscribe({
      next: () => {
        if (this.communityDetails) {
          this.communityDetails.posts = this.communityDetails.posts.filter(p => p.id !== postId);
        }
      },
      error: err => {
        console.error('Erreur lors de la suppression du post', err);
      }
    });
  }
  generatePost(communityId: number) {
    this.isLoading = true; // Début du chargement
    this.generatedPost = null; // Réinitialiser le message généré
    this.showConfirmation = false; // Réinitialiser l'état de confirmation
    
    // Appel au service pour générer le post
    this.postService.generatePost(communityId).subscribe({
      next: (data) => {
        this.isLoading = false; // Fin du chargement
        this.generatedPost = data.message; // Assurez-vous que 'data' contient le message généré
        this.showConfirmation = true; // Afficher la fenêtre de confirmation
      },
      error: (err) => {
        this.isLoading = false; // Fin du chargement
        console.error('Erreur lors de la génération du post', err);
      }
    });
  }

  addGeneratedPost() {
    if (this.generatedPost && this.communityId) {
      const post = {
        content: this.generatedPost,
        communityId: this.communityId,
        fullName: this.userData?.name,
        userImage: this.userData?.image
      };

      this.postService.createPost(this.communityId, post, this.userId).subscribe({
        next: () => {
          this.generatedPost = null; // Réinitialiser le message généré après ajout
          this.showConfirmation = false; // Fermer la confirmation
          this.loadData(); // Recharger les données après l'ajout
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du post', err);
        }
      });
    }
  }

  reportPost(postId: number): void {
    this.postService.reportPost(postId).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Post signalé',
          text: 'Le post a été signalé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erreur lors du signalement du post', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors du signalement.',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
  toggleSortOrder(value: string) {
    this.sortOrder = value === 'asc' ? 'asc' : 'desc';
  }
    
  get sortedPosts() {
    if (!this.communityDetails) return [];
  
    const postsCopy = [...this.communityDetails.posts]; // Copie pour ne pas modifier directement
    return postsCopy.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
  loadUserCommunities() {
    if (this.userId) {
      this.communityService.getCommunitiesByUser(this.userId).subscribe({
        next: (communities) => {
          this.userCommunities = communities;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des communautés de l’utilisateur', err);
        }
      });
    }
  }
  upvote(postId: number): void {
    this.postService.upvote(postId, this.userId).subscribe({
      next: () => {
        const post = this.communityDetails?.posts.find(p => p.id === postId);
        if (post) post.upvotes += 1;
      },
      error: err => {
        console.error('Erreur lors du upvote', err);
      }
    });
  }
  
  
  downvote(postId: number): void {
    this.postService.downvote(postId, this.userId).subscribe({
      next: () => {
        const post = this.communityDetails?.posts.find(p => p.id === postId);
        if (post) post.downvotes += 1;
      },
      error: err => {
        console.error('Erreur lors du downvote', err);
      }
    });
  }
  
}


