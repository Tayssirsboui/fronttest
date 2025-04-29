import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/notification';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { UserControllerService } from 'src/app/services/services';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount!: number;
  showDropdown: boolean = false;
  currentUserId!: number;
  userData: any;
  userId: any;
  toastr: any;
  private notificationSocket!: WebSocketSubject<any>;


  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserControllerService
  ) {}

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
    this.loadUserData();
    this.fetchNotifications();
    this.initWebSocket();
}
private initWebSocket(): void {
  if (this.userId) {
      const wsUrl = `ws://localhost:8080/ws/notifications?userId=${this.userId}`;
      
      this.notificationSocket = webSocket(wsUrl);
      
      this.notificationSocket.subscribe({
          next: (notification: Notification) => {
              console.log('Nouvelle notification en temps réel:', notification);
              this.notifications.unshift(notification);
              this.updateUnreadCount();
          },
          error: (err) => console.error('WebSocket error:', err),
          complete: () => console.log('WebSocket connection closed')
      });
  }
}

  fetchNotifications(): void {
    this.notificationService.getNotificationsByUser(this.userId).subscribe({
      next: (data) => {
        console.log('🔔 Notifications reçues :', data); // ✅ Log utile
        this.notifications = data;
        this.updateUnreadCount();
        this.notifications.sort(
          (a, b) =>
            new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
        );
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
