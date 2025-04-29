import { Component, OnInit } from '@angular/core';
import { UserControllerService } from 'src/app/services/services/user-controller.service';
import { CustomUserServiceService } from 'src/app/services/services/custom-user-service.service'; // <-- Nouveau
import { User } from 'src/app/services/models/user';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(
    private userService: UserControllerService,
    private customUserService: CustomUserServiceService ,// <-- Injecte le nouveau service
    private cdr: ChangeDetectorRef // 👈 injecte le ChangeDetectorRef ici

  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    });
  }

  banUser(userId: number): void {
    this.customUserService.banUser(userId).subscribe({
      next: () => {
        alert('Utilisateur banni avec succès.');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors du bannissement:', err);
      }
    });
  }

  changeRole(userId: number, newRole: string): void {
    console.log('Role choisi:', newRole); // 👈 Ajoute ça pour voir

    if (!userId || !newRole) {
      console.error('ID ou role manquant');
      return;
    }
    
    this.customUserService.changeUserRole(userId, newRole).subscribe({
      next: () => {
        alert('Rôle modifié avec succès.');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Erreur lors du changement de rôle:', err);
      }
    });}
    toggleBan(user: User): void {
      const previousState = user.accountLocked;
      user.accountLocked = !user.accountLocked;
    
      // ⛔ sans ça, Angular ne voit pas le changement car c'est une simple mutation d'objet
    
      this.customUserService[previousState ? 'unbanUser' : 'banUser'](user.idUser!).subscribe({
        next: () => {
          this.cdr.detectChanges(); // 👈 FORCE Angular à redessiner immédiatement
        },
        error: (err) => {
          console.error('Erreur lors du changement de bannissement:', err);
          user.accountLocked = previousState; // rollback si erreur
          this.cdr.detectChanges(); // 👈 update aussi en cas d'erreur
        }
      });
    }
    
    
    
    
}  