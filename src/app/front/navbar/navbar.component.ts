import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  notifications: any[] = [];

  // constructor(private notificationService: NotificationService) {}

  // ngOnInit() {
  //   this.notificationService.notifications$.subscribe(n => {
  //     this.notifications = n;
  //   });}
}
