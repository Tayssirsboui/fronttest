import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { Comment } from 'src/app/models/comment';
import { ToastrService } from 'ngx-toastr';
import { postRecommendationService } from 'src/app/services/post-recommendation.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  commentForm: FormGroup;
  editMode: boolean = false;
  selectedCommentId: number | null = null;
  showEmojiPicker = false;
  comments!: Comment[];
  userId!: number ;
  id!: number;
  post!: Post;
  loadingEnhancement: boolean = false;
  userData: any;

  constructor(
    private bs: BlogService,
    private toastr: ToastrService,
    private Ac: ActivatedRoute,
    private enhancementService: postRecommendationService,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      description: ['', [Validators.required]],
      createdBy: ['', Validators.required] // <-- kept this since it's used in template
    });
  }

  
  ngOnInit() {
    // Initialize the postId (id) once here
    this.id = +this.Ac.snapshot.paramMap.get('id')!;
    this.bs.getPostsById(this.id).subscribe(data => {
      this.post = data;
    });
    this.loadUserData(); 


    // Get the comments for the post on page load
    this.refreshComments();
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
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.emoji-picker-container') &&
        !(event.target as HTMLElement).closest('.btn-emoji')) {
      this.showEmojiPicker = false;
    }
  }

  onSelectEmojis(event: any): void {
    const emoji = event.emoji?.native;
    const currentText = this.commentForm.get('description')?.value || '';
    this.commentForm.patchValue({
      description: currentText + emoji
    });
  }

  enhanceComment(): void {
    const raw = this.commentForm.value.description;
    
    // Vérifier si le commentaire n'est pas vide
    if (!raw?.trim()) {
      alert("Veuillez saisir un commentaire à améliorer.");
      return;
    }
  
    // Affichage du loader
    this.loadingEnhancement = true;
  
    // Appel au service pour améliorer le commentaire
    this.enhancementService.enhanceComment(raw).subscribe({
      next: (res) => {
        // Mettre à jour la valeur du commentaire dans le formulaire avec le texte amélioré
        this.commentForm.patchValue({ description: res.enhanced_comment });
        // Afficher un message de succès
        this.toastr.success("Commentaire enrichi automatiquement !");
        
        // Cacher le loader
        this.loadingEnhancement = false;
      },
      error: () => {
        // En cas d'erreur, cacher le loader et afficher un message d'erreur
        this.loadingEnhancement = false;
        this.toastr.error("Erreur lors de l'enrichissement du commentaire.");
      }
    });
  }
  

  addComment(): void {
    const trimmedDescription = this.commentForm.value.description?.trim();

    if (!trimmedDescription) {
      alert("Le champ commentaire est vide !");
      return;
    }

    // ✅ Patch createdBy if it's required
    this.commentForm.patchValue({
      description: trimmedDescription,
      createdBy: 'CurrentUserName' // <-- Replace with real username if available
    });

    const commentData = {
      ...this.commentForm.value,
      postId: this.id,  // Use the postId (this.id)
      userId: this.userId
    };

    if (this.editMode && this.selectedCommentId) {
      this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe(() => {
        this.toastr.info('Commentaire modifié avec succès.', 'Info');
        this.refreshComments();
        this.resetForm();
      });
    } else {
      this.bs.addComment(this.id, this.userId, commentData).subscribe(() => {
        this.toastr.success('Commentaire ajouté avec succès.');
        this.refreshComments();
        this.resetForm();
      });
    }
  }

  editComment(comment: any) {
    this.editMode = true;
    this.selectedCommentId = comment.idComment;
    this.commentForm.patchValue({
      description: comment.description,
      createdBy: comment.createdBy // ✅ fill in required field
    });
  }

  resetForm() {
    this.commentForm.reset();
    this.editMode = false;
    this.selectedCommentId = null;
  }

  refreshComments(): void {
    // No need to reset this.id here, it's already set in ngOnInit
    this.bs.getcommentsByPostId(this.id).subscribe((data: any) => {
      console.log('Loaded comments for post', this.id, ':', data);
      this.comments = data as Comment[];
      this.post.commentsCount = this.comments.length;
    });
  }

  likeComment(commentId: number): void {
    this.bs.likeComment(commentId, this.userId).subscribe({
      next: () => {
        const comment = this.comments.find(c => c.idComment === commentId);
        if (comment && !comment.likedByUser) {
          comment.likes = (comment.likes || 0) + 1;
          comment.likedByUser = true; // prevent further increments on front
        }
      },
      error: (err) => {
        console.error('Error liking comment:', err);
      }
    });
  }
  
}