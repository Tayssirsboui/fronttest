import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projet } from 'src/app/models/projet';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent {
  projet: Projet;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Projet) {
    this.projet = data;
  }
}
