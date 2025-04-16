import { Component, OnInit } from '@angular/core';
import { Collaboration } from 'src/app/models/collaboration';
import { CollaborationService } from 'src/app/services/collaboration.service';
import { MatDialog } from '@angular/material/dialog';
import { AjouterCollaborationComponent } from '../ajouter-collaboration/ajouter-collaboration.component';

@Component({
  selector: 'app-collaborations',
  templateUrl: './collaborations.component.html',
  styleUrls: ['./collaborations.component.css']
})
export class CollaborationsComponent implements OnInit {
  collaborations: Collaboration[] = [];

  constructor(
    private collaborationService: CollaborationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCollaborations();
  }

  loadCollaborations() {
    this.collaborationService.getCollaborations().subscribe(data => {
      this.collaborations = data;
    });
  }

  onAnnuler(collabId: number): void {
    if (confirm("Êtes-vous sûr de vouloir annuler cette collaboration ?")) {
      this.collaborationService.deleteCollaboration(collabId).subscribe(() => {
        this.loadCollaborations();
      });
    }
  }

  onModifier(collab: Collaboration): void {
    const dialogRef = this.dialog.open(AjouterCollaborationComponent, {
      width: '500px',
      data: collab
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCollaborations();
      }
    });
  }
}
