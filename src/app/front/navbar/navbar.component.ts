import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/services/authentification.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount!: number;
  showDropdown: boolean = false;
  currentUserId!: number ; // 🔥 dynamic ID! 

  constructor(private notificationService: NotificationService,private authService: AuthentificationService,private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  goToProfile() {
    if (this.isLoggedIn()) {
      this.router.navigate(['/profil']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private decodeTokenPayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode token payload', error);
      return null;
    }
  }

  loadUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = this.decodeTokenPayload(token);
      if (payload) {
        this.userData = payload;
        this.userId = payload.id || payload.userId || payload._id;
        console.log('Utilisateur connecté :', this.userData);
      }
    } else {
      console.error('Token non trouvé dans localStorage');
      this.toastr?.error('Utilisateur non connecté', 'Erreur');
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.authService.decodeToken(token);
      this.currentUserId = decoded?.id;
      this.fetchNotifications();
    }
  }

  fetchNotifications(): void {
    this.notificationService.getNotificationsByUser(this.userId).subscribe({
      next: (data) => {
        this.notifications = data || [];
        this.notifications.sort((a, b) => 
          new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
        );
        this.updateUnreadCount();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications', err);
      },
    });
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter((n) => !n.seen).length; // ✅ Correction ici
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.markAllAsSeen();
    }
  }

  markAllAsSeen(): void {
    for (let notif of this.notifications) {
      if (!notif.seen && notif.id) {
        this.notificationService.markAsSeen(notif.id).subscribe({
          next: () => {
            notif.seen = true;
            this.updateUnreadCount();
          },
          error: (err) => {
            console.error('Erreur lors du marquage comme vu', err);
          },
        });
      }
    }
  }

  onNotificationClick(notif: Notification) {
    if (!notif.seen && notif.id) {
      this.notificationService.markAsSeen(notif.id).subscribe(() => {
        notif.seen = true;
        this.updateUnreadCount();
      });
    }
  }
}
