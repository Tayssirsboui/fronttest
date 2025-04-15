import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Renderer2, Inject} from '@angular/core';

@Component({
  selector: 'app-back-layout',
  templateUrl: './back-layout.component.html',
  styleUrls: ['./back-layout.component.css']
})
export class BackLayoutComponent implements OnInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/back/css/styles.min.css';
    this.renderer.appendChild(this.document.head, link);
  }
}
