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

  constructor(
    private route: ActivatedRoute,
    private communityService: CommunityService,
    private postService: PostService,
    private router: Router  // Injecte le Router ici

  ) {}

  ngOnInit(): void {
    // Récupère l'ID de la communauté depuis les paramètres d'URL
    this.communityId = Number(this.route.snapshot.paramMap.get('id'));

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
  

  createPost() {
    const user = JSON.parse(localStorage.getItem('user')!);
  const post = {
    content: this.newPostContent,
    communityId: this.communityId,
    userName: user.name,
    userImage: user.image
  };
    this.postService.createPost(post).subscribe(() => {
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
  
  
  
}


