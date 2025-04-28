import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  

})
export class NavbarComponent implements OnInit {

  notifications: Notification[] = [];
  unreadCount: number = 0;
  showDropdown: boolean = false;
  currentUserId!: number ; // 🔥 TEMPORARY STATIC ID! (later replace with logged-in user ID)

  constructor(private notificationService: NotificationService,private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user'); // or check your auth service
  }

  goToProfile() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profil']);
    } else {
      this.router.navigate(['/login']);
    }
  }
 
  ngOnInit(): void {
    this.fetchNotifications();
    
  }

  fetchNotifications(): void {
    this.notificationService.getNotificationsByUser(this.currentUserId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.unreadCount = data.length;
      this.updateUnreadCount();
      // 🧠 Sort notifications by newest first
    this.notifications.sort((a, b) => 
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
      // You can improve later with a read/unread system
      },
      error: (err) => {
        console.error('Error fetching notifications', err);
      }
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    
    // If opening the dropdown and there are unread notifications
    if (this.showDropdown) {
      this.markAllAsSeen();
    }
  }
  
  markAllAsSeen(): void {
    for (let notif of this.notifications) {
      if (!notif.seen && notif.id) {
        this.notificationService.markAsSeen(notif.id).subscribe({
          next: (updatedNotif) => {
            notif.seen = true;
            this.updateUnreadCount();
          },
          error: (err) => {
            console.error('Error marking notification as seen', err);
          }
        });
      }
    }
  }
  
  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(notif => !notif.seen).length;
  }
  onNotificationClick(notif: Notification) {
    if (!notif.seen && notif.id) {
      this.notificationService.markAsSeen(notif.id).subscribe(() => {
        notif.seen = true;
        this.updateUnreadCount(); // refresh badge
      });
    }}
}
