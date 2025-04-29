import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar-back',
  templateUrl: './sidebar-back.component.html',
  styleUrls: ['./sidebar-back.component.css']
})
export class SidebarBackComponent {
    constructor(private router: Router) {}
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // or check your auth service
  }

  goToProfile() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/back/profil']);
    } else {
      this.router.navigate(['/login']);
    }
  }

}
