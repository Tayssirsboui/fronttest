import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CensorshipService } from 'src/app/services/censorship.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit{
  communityId!: number;
  communityName!: string;
  postContent: string = '';
  imageUrl: string = ''; // ✅ Nouveau champ
  videoUrl: string = '';


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private censorshipService: CensorshipService

  ) {}

  ngOnInit(): void {
    this.communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.communityName = this.route.snapshot.queryParamMap.get('name') || '';
  }

  submitPost() {
    const censoredContent = this.censorshipService.cleanText(this.postContent);

    const postPayload = {

      content: censoredContent,
      imageUrl: this.imageUrl, // ✅ inclure l'URL de l'image
      videoUrl: this.videoUrl, // ✅ inclure l'URL de la vidéo

      

      communityId: this.communityId,
      userId: 1 // Tu peux remplacer ça par l’utilisateur courant plus tard
    };

    this.http
      .post(`http://localhost:5600/api/communities/${this.communityId}/post`, postPayload)
      .subscribe({
        next: () => this.router.navigate([`/community/${this.communityId}`]),
        error: (err) => alert('Erreur lors de la création du post')
      });
  }
  showEmojiPicker: boolean = false;

toggleEmojiPicker() {
  this.showEmojiPicker = !this.showEmojiPicker;
}

addEmoji(event: any) {
  const emoji = event?.emoji?.native || event?.native || event;
  this.postContent += emoji;
}


}
