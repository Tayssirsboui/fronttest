import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { Comment } from 'src/app/models/comment';
import { ToastrService } from 'ngx-toastr';
import { postRecommendationService } from 'src/app/services/post-recommendation.service'; // <-- Ajouter ce service

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
  showEmojis: boolean = false;
  showGifPicker: boolean = false;
  comments!: Comment[];
  newCommentContent: string = '';
  userId: number = 1;
  id!: number;
  post!: Post;
  commentsCount!: number;

  constructor(
    private bs: BlogService,
    private toastr: ToastrService,
    private Ac: ActivatedRoute,
    private enhancementService: postRecommendationService,// <-- Ajoute ceci
    private route: Router,
    private fb: FormBuilder  ) {
    this.commentForm = this.fb.group({
      description: ['', [Validators.required]],
      createdBy: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.id = +this.Ac.snapshot.paramMap.get('id')!;
    this.bs.getPostsById(this.id).subscribe(data => {
      this.post = data;
    });

    this.bs.getcommentsByPostId(this.id).subscribe((data: any) => {
      this.comments = data as Comment[];
      const commentsCount = data.length;
      if (this.post) {
        this.post.commentsCount = commentsCount;
      }
    });
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

  toggleGifPicker() {
    this.showGifPicker = !this.showGifPicker;
  }

  calculateCommentsCount(): number {
    if (this.comments) {
      const commentsCount = this.comments.length;
      if (this.post) {
        this.post.commentsCount = commentsCount;
      }
      return commentsCount;
    }
    return 0;
  }

  // 💡 NOUVEAU : améliorer le commentaire avec Flask avant de l’envoyer
  enhanceComment(): void {
    const raw = this.commentForm.value.description;
    if (!raw?.trim()) {
      alert("Veuillez saisir un commentaire à améliorer.");
      return;
    }

    this.enhancementService.enhanceComment(raw).subscribe({
      next: (res) => {
        this.commentForm.patchValue({ description: res.enhanced_comment });
        this.toastr.success("Commentaire enrichi automatiquement !");
      },
      error: () => {
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

    this.commentForm.patchValue({ description: trimmedDescription });

    const commentData = {
      ...this.commentForm.value,
      postId: this.id,
      userId: this.userId
    };

    if (this.editMode && this.selectedCommentId) {
      this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe(() => {
        this.toastr.info('Commentaire modifié avec succès.', 'Info');
        this.ngOnInit();
        this.resetForm();
      });
    } else {
      this.bs.addComment(this.id, this.userId, commentData).subscribe(() => {
        this.toastr.success('Commentaire ajouté avec succès.');
        this.ngOnInit();
        this.resetForm();
      });
    }
  }

  editComment(comment: any) {
    this.editMode = true;
    this.selectedCommentId = comment.idComment;
    this.commentForm.patchValue({
      description: comment.description
    });
  }

  resetForm() {
    this.commentForm.reset();
    this.editMode = false;
    this.selectedCommentId = null;
  }
}
