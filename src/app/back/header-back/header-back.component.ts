import { Component } from '@angular/core';

@Component({
  selector: 'app-header-back',
  templateUrl: './header-back.component.html',
  styleUrls: ['./header-back.component.css']
})
export class HeaderBackComponent {
  showNotifications = false;

  notifications = [
    { message: "Nouvelle commande reçue", date: new Date() },
    { message: "Nouveau message client", date: new Date() },
    { message: "Mise à jour disponible", date: new Date() }
  ];
  
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  
}
