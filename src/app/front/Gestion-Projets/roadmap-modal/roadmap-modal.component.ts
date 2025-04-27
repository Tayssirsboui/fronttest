import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Collaboration } from 'src/app/models/collaboration';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from 'src/app/services/ai.service';
import { TacheService } from 'src/app/services/tache.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roadmap-modal',
  templateUrl: './roadmap-modal.component.html',
  styleUrls: ['./roadmap-modal.component.css']
})
export class RoadmapModalComponent implements OnInit {
  taskForm: FormGroup;
  subtasks: any[] = [];
  existingTasks: any[] = [];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<RoadmapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public collab: Collaboration,
    private fb: FormBuilder,
    private aiService: AiService,
    private tacheService: TacheService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({ description: [''] });
  }

  ngOnInit(): void {
    try {
      if (!this.collab || !this.collab.projet) {
        console.error("❌ collab ou collab.projet est null", this.collab);
        this.dialogRef.close();
        return;
      }
      this.existingTasks = this.collab.projet.taches || [];
      console.log('✅ Collaboration reçue dans le modal:', this.collab);
    } catch (e) {
      console.error("❌ Erreur dans ngOnInit:", e);
      this.dialogRef.close();
    }
  }

  genererRoadmap(): void {
    this.loading = true;
    const projetId = this.collab.projet.id;

    this.aiService.generateRoadmap(projetId).subscribe({
      next: (res) => {
        this.subtasks = res;
        this.loading = false;
      },
      error: (err) => {
        console.error("Erreur IA:", err);
        this.loading = false;
      }
    });
  }

  validerRoadmap(): void {
    const projetId = this.collab.projet.id;
    const projetTitre = this.collab.projet.titre;
  
    this.subtasks.forEach(task => {
      const formattedTask = {
        ...task,
        description: 'Ajoutée depuis IA',
        priorite: this.convertPriorite(task.priorite),
        statut: 'À faire',
        projetId: projetId, // 🧩 assure le lien
        projet: { id: projetId, titre: projetTitre } // 💡 mini objet Projet
      };
  
      this.tacheService.addTache(formattedTask, projetId).subscribe();
    });
  
    // ✅ Redirection avec délai
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(['/kanban', projetId]);
    }, 1000);
  }
  

  private convertPriorite(p: string): 'Haute' | 'Moyenne' | 'Faible' {
    switch (p.toLowerCase()) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  }
}

