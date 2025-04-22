import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  postForm: FormGroup;
  selectedImage: File | null = null;
  post!: Post;
  id!: number;
userId: number = 1; // Remplacez par l'ID de l'utilisateur connecté


  constructor(
    private fb: FormBuilder,
    private bs: BlogService,
    private rt: Router,
    private act: ActivatedRoute
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      image: [''],
      userId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      createdBy: ['', Validators.required]
    });
  }

 
    ngOnInit(){
    this.id=this.act.snapshot.params['id']
    this.bs.getPostsById(this.id).subscribe(
      (data)=> {
        this.post=data,
        console.log(this.post)
        //3- initialiser le formulaire
        this.postForm.patchValue(this.post)
      }
    )
  }
  
  

  addPosts() {
    const postData = {
      ...this.postForm.value,
      postId: this.id, // Assurez-vous que 'this.id' est défini et contient l'ID du post
      userId: this.userId // Assurez-vous que 'this.userId' contient l'ID de l'utilisateur connecté
    };
    if (this.id) {
      this.bs.updatePost(this.id, this.userId,postData).subscribe(() => {
        this.rt.navigateByUrl('/blog-details/' + this.id);
      });
    } else {
      // Create
      this.bs.addPost(this.postForm.value).subscribe(() => {
        this.rt.navigateByUrl('/blog');
      });
    }
  //   this.bs.postToFacebook("Bonjour depuis Angular + Spring Boot !")
  // .subscribe({
  //   next: () => alert("Message publié sur Facebook !"),
  //   error: err => alert("Erreur de publication : " + err.error.message)
  // });

  }
  // addPosts() {
  //   const postData = {
  //     ...this.postForm.value,
  //     postId: this.id,
  //     userId: this.userId
  //   };
  
  //   const facebookMessage = `📝 Nouveau post: ${postData.title}\n\n${postData.content.substring(0, 100)}...`;
  
  //   if (this.id) {
  //     this.bs.updatePost(this.id, this.userId, postData).subscribe(() => {
       
  //       this.rt.navigateByUrl('/blog-details/' + this.id);
  //     });
  //   } else {
  //     this.bs.addPost(postData).subscribe(() => {
  //       this.bs.postToFacebook(facebookMessage).subscribe({
  //         next: () => alert("Ajouté et publié sur Facebook !"),
  //         error: err => alert("Erreur Facebook : " + err)
  //       });
  //       this.rt.navigateByUrl('/blog');
  //     });
  //   }
  // }
  
}
