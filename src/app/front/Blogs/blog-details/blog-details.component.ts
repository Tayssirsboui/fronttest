import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';
import { Comment } from 'src/app/models/comment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  messageContent: string = ''; // Declare the property to store message content
  commentForm: FormGroup;
  editMode: boolean = false;
selectedCommentId: number | null = null;
showEmojiPicker = false;
 comments!:Comment[];
newCommentContent: string = ''; // Pour stocker le contenu du nouveau commentaire
userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté
  constructor(private bs :BlogService, public toastr: ToastrService,private Ac:ActivatedRoute,private route:Router,private fb: FormBuilder){//ActivatedRoute bch najmo nhezo l id m url
  
    this.commentForm = this.fb.group({
          description: ['', [Validators.required]],
          createdBy: ['', Validators.required]
        });
  }
    id!:number;
    post!:Post;
   
    commentsCount!: number; // Ajoutez cette propriété pour stocker le nombre de commentaires

// Fonction pour basculer l'affichage du picker
testToast() {
  this.toastr.success('Hello world!', 'Toastr fun!');
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

    ngOnInit() {
      this.id = +this.Ac.snapshot.paramMap.get('id')!;
    
      this.bs.getPostsById(this.id).subscribe(data => {
        this.post = data;
      });
    
      this.bs.getcommentsByPostId(this.id).subscribe((data: any) => {
        console.log("Commentaires reçus :", data);
        this.comments = data as Comment[];
      
        // Ajoutez cette constante pour calculer le nombre de commentaires
        const commentsCount = data.length;
        console.log(`Nombre de commentaires pour ce post: ${commentsCount}`);
        
        // Si vous voulez stocker ce count dans le post
        if (this.post) {
          this.post.commentsCount = commentsCount;
        }
      });
    }
    showEmojis: boolean = false;// Ajoutez cette méthode pour gérer la sélection d'emoji
    onSelectEmojis(event: any): void {
      const emoji = event.emoji?.native;
      const currentText = this.commentForm.get('description')?.value || '';
      this.commentForm.patchValue({
        description: currentText + emoji
      });
    }
    showGifPicker: boolean = false;

toggleGifPicker() {
  this.showGifPicker = !this.showGifPicker;
}

    
    calculateCommentsCount(): number {
      if (this.comments) {
        const commentsCount = this.comments.length;
        console.log(`Nombre actuel de commentaires: ${commentsCount}`);
        
        // Mettre à jour la propriété du post si nécessaire
        if (this.post) {
          this.post.commentsCount = commentsCount;
        }
        
        return commentsCount;
      }
      return 0;
    }
    
    
  //   addComment() {
   
  //     this.bs.addComment(this.commentForm.value).subscribe(
  //     ()=> this.route.navigateByUrl('blog-details/'+this.id)
  // );
  //  }
  
  // addComment() {
  //   const commentData = {
  //     ...this.commentForm.value,
  //     postId: this.id, // Assurez-vous que 'this.id' est défini et contient l'ID du post
  //     userId: this.userId // Assurez-vous que 'this.userId' contient l'ID de l'utilisateur connecté
  //   };
  
  //   if (this.editMode && this.selectedCommentId) {
  //     console.log("Mise à jour du commentaire ID :", this.selectedCommentId); // 👈 debug
  //     this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe(() => {
  //       alert("Commentaire modifié avec succès !");
  //       this.ngOnInit(); // Recharger les commentaires après modification
  //       this.resetForm(); // Réinitialiser le formulaire après modification
  //     });
  //   } else {
  //     this.bs.addComment(this.id, this.userId, commentData).subscribe(() => {
  //       alert("Commentaire ajouté avec succès !");
  //       this.ngOnInit(); // Recharger les commentaires après ajout
  //       this.resetForm(); // Réinitialiser le formulaire après ajout
  //     });
  //   }
  // }
  addComment(): void {
    // Récupérer et nettoyer le contenu
    const trimmedDescription = this.commentForm.value.description?.trim();
  
    if (!trimmedDescription) {
      alert("Le champ commentaire est vide !");
      return;
    }
  
    // Mettre à jour manuellement la valeur du formulaire nettoyée
    this.commentForm.patchValue({
      description: trimmedDescription
    });
  
    const commentData = {
      ...this.commentForm.value,
      postId: this.id,
      userId: this.userId
    };
  
    if (this.editMode && this.selectedCommentId) {
      console.log("Mise à jour du commentaire ID :", this.selectedCommentId);
      this.bs.updateComment(this.selectedCommentId!, this.userId, commentData).subscribe(() => {
        this.toastr.info('modification avec réussie', 'info'),
        this.ngOnInit();
        this.resetForm();
      });
    } else {
      this.bs.addComment(this.id, this.userId, commentData).subscribe(() => {
        alert("Commentaire ajouté avec succès !");
        this.ngOnInit();
        this.resetForm();
      });
    }
  }
  
  
   editComment(comment: any) {
    console.log("Édition du commentaire :", comment); // 👈 vérifie dans la console
  
    this.editMode = true;
    this.selectedCommentId = comment.idComment; // attention ici : peut-être que c'est `idComment`, pas `id`
  
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