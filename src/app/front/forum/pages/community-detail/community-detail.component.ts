import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';
import { PostService } from 'src/app/services/post.service';
import { CommunityWithPostsDTO } from 'src/app/models/community.model';


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
    userName: user.name,
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
    this.postService.generatePost(communityId).subscribe({
      next: () => {
        this.loadData(); // Recharge les données pour afficher le nouveau post
      },
      error: (err) => console.error('Erreur lors de la génération du post', err)
    });
  }
  reportPost(postId: number): void {
    this.postService.reportPost(postId).subscribe({
      next: () => {
        alert('Post signalé avec succès');
      },
      error: (err) => {
        console.error('Erreur lors du signalement du post', err);
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
  
  
}


