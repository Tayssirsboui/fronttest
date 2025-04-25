import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColumnsModel } from '@syncfusion/ej2-angular-kanban';
import { Tache } from 'src/app/models/tache';
import { TacheService } from 'src/app/services/tache.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-kanban',
  templateUrl: './dashboard-kanban.component.html',
  styleUrls: ['./dashboard-kanban.component.css']
})
export class DashboardKanbanComponent implements OnInit {
  @ViewChild('addTaskDialog') addTaskDialog!: TemplateRef<any>;

  taskForm!: FormGroup;
  projectId: number = 0;
  dataSource: Tache[] = [];
  progressValue = 0;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tacheService: TacheService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: ['Moyenne', Validators.required],
      estimation: [''],
      statut: ['À faire']
    });

    this.loadTaches();
  }

  loadTaches() {
    this.tacheService.getTachesByProjetId(this.projectId).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.updateProgress();
      },
      error: (err) => {
        console.error('Erreur chargement des tâches:', err);
      }
    });
  }

  updateProgress() {
    const total = this.dataSource.length;
    const done = this.dataSource.filter(t => t.statut === 'Terminé').length;
    this.progressValue = total > 0 ? (done / total) * 100 : 0;
  }

  openAddTaskDialog() {
    this.taskForm.reset({
      priorite: 'Moyenne',
      statut: 'À faire'
    });
    this.dialog.open(this.addTaskDialog);
  }

  submitTask() {
    if (this.taskForm.valid) {
      const newTask: Tache = {
        ...this.taskForm.value,
        projetId: this.projectId
      };

      this.tacheService.addTache(newTask, this.projectId).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.loadTaches();
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout de tâche:', err);
        }
      });
    }
  }

  deleteTask(id?: number) {
    if (!id) return;
    this.tacheService.deleteTache(id).subscribe(() => this.loadTaches());
  }

  getPriorityClass(priorite: string): string {
    switch (priorite.toLowerCase()) {
      case 'haute': return 'high';
      case 'moyenne': return 'medium';
      case 'faible': return 'low';
      default: return '';
    }
  }

  onKanbanAction(args: any): void {
    if (args.requestType === 'cardChanged' && args.changedRecords.length > 0) {
      const updatedTask: Tache = args.changedRecords[0];
  
      // Ensure projetId is kept
      if (!updatedTask.projetId) {
        updatedTask.projetId = this.projectId;
      }
  
      // Call the new endpoint to update only the status
      this.tacheService.updateStatut(updatedTask.id!, updatedTask.statut).subscribe({
        next: () => {
          this.loadTaches(); // refresh list and update progress bar
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
        }
      });
    }
  }
  
}

