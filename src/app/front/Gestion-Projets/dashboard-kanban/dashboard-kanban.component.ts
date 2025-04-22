import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColumnsModel } from '@syncfusion/ej2-angular-kanban';
import { Tache } from 'src/app/models/tache';
import { TacheService } from 'src/app/services/tache.service';

@Component({
  selector: 'app-dashboard-kanban',
  templateUrl: './dashboard-kanban.component.html',
  styleUrls: ['./dashboard-kanban.component.css']
})
export class DashboardKanbanComponent implements OnInit {
  @ViewChild('addTaskDialog') addTaskDialog!: TemplateRef<any>;

  taskForm!: FormGroup;
  projectId: number=7; // Assuming you get this from a service or route parameter
  columns: ColumnsModel[] = [
    { headerText: 'À faire', keyField: 'To Do' },
    { headerText: 'En cours', keyField: 'In Progress' },
    { headerText: 'Terminé', keyField: 'Done' }
  ];

  dataSource: Tache[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      priorite: ['Medium', Validators.required],
      estimation: [''],
      statut: ['To Do']
    });

    this.loadTaches();
  }

  loadTaches() {
    this.tacheService.getTaches().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: (err) => {
        console.error('Erreur chargement des tâches:', err);
      }
    });
  }

  getPriorityClass(priorite: string): string {
    switch (priorite.toLowerCase()) {
      case 'haute':
        return 'high';
      case 'moyenne':
        return 'medium';
      case 'faible':
        return 'low';
      default:
        return '';
    }
  }
  
  openAddTaskDialog() {
    this.taskForm.reset({
      priorite: 'Medium',
      statut: 'To Do'
    });
    this.dialog.open(this.addTaskDialog);
  }

  submitTask() {
    if (this.taskForm.valid) {
      const newTask: Tache = {
        ...this.taskForm.value
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
}
