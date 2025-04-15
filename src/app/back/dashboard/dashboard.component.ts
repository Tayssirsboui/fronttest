import { Component , AfterViewInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private renderer: Renderer2) {}

  // ngAfterViewInit(): void {
  //   this.loadScript('assets/back/js/dashboard.js');
  // }

  // loadScript(src: string) {
  //   const script = this.renderer.createElement('script');
  //   script.src = src;
  //   script.type = 'text/javascript';
  //   script.defer = true;
  //   this.renderer.appendChild(document.body, script);
  // }
}
