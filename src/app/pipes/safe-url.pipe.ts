import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeResourceUrl {
    if (!value) return '';

    // Convertir youtu.be/xuP4g7IDgDM en www.youtube.com/embed/xuP4g7IDgDM
    let embedUrl = value;

    const youtubeShort = value.match(/^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const youtubeLong = value.match(/^https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);

    if (youtubeShort) {
      embedUrl = `https://www.youtube.com/embed/${youtubeShort[1]}`;
    } else if (youtubeLong) {
      embedUrl = `https://www.youtube.com/embed/${youtubeLong[2]}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
