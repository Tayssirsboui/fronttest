import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ColumnsModel } from '@syncfusion/ej2-angular-kanban';
import { Tache } from 'src/app/models/tache';
import { TacheService } from 'src/app/services/tache.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-dashboard-kanban',
  templateUrl: './dashboard-kanban.component.html',
  styleUrls: ['./dashboard-kanban.component.css']
})
export class DashboardKanbanComponent implements OnInit {
  @ViewChild('addTaskDialog') addTaskDialog!: TemplateRef<any>;
  @ViewChild('editTaskDialog') editTaskDialog!: TemplateRef<any>;

  taskForm!: FormGroup;
  projectId: number = 0;
  dataSource: Tache[] = [];
  progressValue = 0;
  currentEditingTask: Tache | null = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private tacheService: TacheService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;

        this.taskForm = this.fb.group({
          projetId: [this.projectId],
          titre: ['', Validators.required],
          description: ['', Validators.required],
          estimation: [''],
          priorite: ['Moyenne', Validators.required],
          statut: ['À faire'],
          
        });

        this.loadTaches();
      }
    });
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
      projetId: this.projectId,
      titre: '',
      description: '',
      estimation: '',
      priorite: 'Moyenne',
      statut: 'À faire',
      
    });
    this.dialog.open(this.addTaskDialog);
  }
  submitTask() {
    if (this.taskForm.valid) {
      const newTask: Tache = this.taskForm.value;
      this.tacheService.addTache(newTask, this.projectId).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.loadTaches();
          Swal.fire({
            icon: 'success',
            title: 'Tâche ajoutée !',
            text: 'La tâche a été ajoutée avec succès.'
          });
        },
        error: (err) => {
          console.error('Erreur lors de l’ajout de tâche:', err);
        }
      });
    }
  }
  

  openEditTaskDialog(task: Tache) {
    this.currentEditingTask = task;
    this.taskForm.setValue({
      projetId: task.projetId || this.projectId,
      titre: task.titre,
      description: task.description,
      estimation: task.estimation,
      priorite: task.priorite,
      statut: task.statut,
      
    });
    this.dialog.open(this.editTaskDialog);
  }

  submitEditTask() {
    if (this.taskForm.valid && this.currentEditingTask) {
      const updated: Tache = {
        ...this.currentEditingTask,
        ...this.taskForm.value
      };
      this.tacheService.updateTache(updated).subscribe({
        next: () => {
          this.dialog.closeAll();
          this.loadTaches();
          this.currentEditingTask = null;
          Swal.fire({
            icon: 'success',
            title: 'Modifiée !',
            text: 'La tâche a été modifiée avec succès.'
          });
        },
        error: (err) => {
          console.error('Erreur de modification :', err);
        }
      });
    }
  }
  

  deleteTask(id?: number) {
    if (!id) return;
  
    Swal.fire({
      title: "Supprimer la tâche ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !"
    }).then((result) => {
      if (result.isConfirmed) {
        this.tacheService.deleteTache(id).subscribe(() => {
          this.loadTaches();
          Swal.fire({
            title: "Supprimée !",
            text: "La tâche a été supprimée.",
            icon: "success"
          });
        });
      }
    });
  }

  onKanbanAction(args: any): void {
    if (args.requestType === 'cardChanged' && args.changedRecords.length > 0) {
      const updatedTask: Tache = args.changedRecords[0];

      if (!updatedTask.projetId) {
        updatedTask.projetId = this.projectId;
      }

      this.tacheService.updateStatut(updatedTask.id!, updatedTask.statut).subscribe({
        next: () => {
          this.loadTaches();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
        }
      });
    }
  }

  getPriorityClass(priorite: string | null | undefined): string {
    if (!priorite) return '';
    switch (priorite.toLowerCase()) {
      case 'haute': return 'high';
      case 'moyenne': return 'medium';
      case 'faible': return 'low';
      default: return '';
    }
  }
  exportToPDF(): void {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Liste des Tâches', 14, 15);
  
    const taskData = this.dataSource.map((tache, index) => [
      index + 1,
      tache.titre,
      tache.description,
      tache.estimation || '-',
      tache.priorite,
      tache.statut
    ]);
  
    autoTable(doc, {
      startY: 20,
      head: [['#', 'Titre', 'Description', 'Estimation', 'Priorité', 'Statut']],
      body: taskData
    });
  
    doc.save('liste-taches.pdf');
  }
  
}
