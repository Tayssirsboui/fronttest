import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { Comment } from 'src/app/models/comment';
import { ToastrService } from 'ngx-toastr';
import { postRecommendationService } from 'src/app/services/post-recommendation.service';
import { UserControllerService } from 'src/app/services/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';


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
  postUser: any;
  recorder: any;
  isRecording: boolean = false;
  audioStream: any;
  transcribedText: string = '';
  currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(
    private bs: BlogService,
    private toastr: ToastrService,private http: HttpClient,
    private Ac: ActivatedRoute,
    private enhancementService: postRecommendationService,
    private route: Router,
    private fb: FormBuilder, private userService: UserControllerService,private location: Location
  ) {
    this.commentForm = this.fb.group({
      description: ['', [Validators.required]],
      
      createdBy: ['', Validators.required] // <-- kept this since it's used in template
    });
  }
  scrollToCommentForm(): void {
  const element = document.getElementById('addCommentForm');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Fonction pour lire en haute voix
  readAloud(text: string, lang: 'fr' | 'en' = 'fr'): void {
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.warn('Texte invalide ou vide.');
      return;
    }
  
    const speechSynthesis = window.speechSynthesis;
  
    // Si une lecture est en cours, on l'arrête
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      this.currentUtterance = null;
      console.log('Lecture arrêtée.');
      return;
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
  
    // Choisir la langue
    utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    utterance.volume = 1.0; // max = 1
    utterance.rate = 1;
    utterance.pitch = 1;
  
    this.currentUtterance = utterance;
  
    speechSynthesis.speak(utterance);
  }
  deleteComment(idComment: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce commentaire sera définitivement supprimé.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bs.deleteComment(idComment).subscribe({
          next: () => {
            this.comments = this.comments.filter(c => c.idComment !== idComment);
            this.toastr.success('Commentaire supprimé avec succès');
          },
          error: err => {
            console.error('Erreur de suppression du commentaire:', err);
            this.toastr.error('Échec de la suppression du commentaire');
          }
        });
      }
    });
  }
  ngOnInit() {
    this.scrollToTop();
    this.id = +this.Ac.snapshot.paramMap.get('id')!;
    
    // Récupérer le post
    this.bs.getPostsById(this.id).subscribe(data => {
      this.post = data;
  
      // ✅ Récupérer aussi l'utilisateur qui a créé ce post
      if (this.post.userId) {
        this.userService.getUserById({ id: this.post.userId }).subscribe(user => {
          this.postUser = user;
        }, error => {
          console.error("Erreur récupération user du post:", error);
        });
      }
    });
  
    this.loadUserData(); 
    this.refreshComments();
  }
 
  
  
  
  
  stopRecording() {
    this.recorder.stopRecording(() => {
      const audioBlob = this.recorder.getBlob();
      this.uploadToFlask(audioBlob);  // Call the function to upload audio for transcription
    });
  }
  uploadToFlask(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');  // Important: use same key as in Flask

    this.http.post<any>('http://localhost:5000/transcribe', formData).subscribe({
      next: (res) => {
        console.log('Transcription:', res);
        if (res.transcription) {  // Assuming Flask returns transcribed text under "transcription"
          // Add the transcribed text to the description
          this.commentForm.patchValue({ description: res.transcription });
        }
      },
      error: (err) => {
        console.error('Erreur transcription:', err);
      }
    });
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
this.commentForm.get('description')?.markAsDirty(); // <-- Add this

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
      Swal.fire({
        icon: 'warning',
        title: 'Champ vide',
        text: 'Le champ commentaire est vide !',
      });
      return;
    }
  
    this.commentForm.patchValue({
      description: trimmedDescription,
      createdBy: this.userData?.username || 'Anonymous'
    });
  
    const commentData = {
      ...this.commentForm.value,
      postId: this.id,
      userId: this.userId
    };
  
    if (this.editMode && this.selectedCommentId) {
    this.scrollToCommentForm();

      this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Commentaire modifié',
            text: 'Le commentaire a été modifié avec succès.',
          });
          this.refreshComments();
          this.resetForm();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la modification.',
          });
        }
      });
    } else {
      this.bs.addComment(this.id, this.userId, commentData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Commentaire ajouté',
            text: 'Votre commentaire a été publié avec succès.',
          });
          this.refreshComments();
          this.resetForm();
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible d\'ajouter le commentaire.',
          });
        }
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
     // Pour chaque commentaire, récupérer l'utilisateur
     this.comments.forEach(comment => {
      if (comment.userId) {
        this.userService.getUserById({ id: comment.userId }).subscribe(user => {
          comment.user = user; // Ajouter l'utilisateur directement dans le commentaire
        });
      }
    });
  });}

  likeComment(commentId: number): void {
    // Check if the user has already liked the comment
    const comment = this.comments.find(c => c.idComment === commentId);
    
    if (!comment) return; // Handle the case where the comment is not found

    // If the user has already liked the comment, don't do anything
    if (comment.likedByUser) {
        return;
    }

    // If the user hasn't liked it yet, proceed with liking the comment
    this.bs.likeComment(commentId, this.userId).subscribe({
        next: () => {
            // Increment the likes counter
            comment.likes = (comment.likes || 0) + 1;
            // Mark the comment as liked by the user
            comment.likedByUser = true;
        },
        error: (err) => {
            console.error('Error liking comment:', err);
        }
    });
}

goBack() {
  this.location.back();
}
  
}