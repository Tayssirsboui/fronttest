import { Component } from '@angular/core';
import { StageService } from '../../../services/stage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bstages',
  templateUrl: './bstages.component.html',
  styleUrls: ['./bstages.component.css']
})
export class BstagesComponent {
  stages: any[] = [];
  isLoading = true;
  showModal = false;

  editMode = false;
  selectedStageId: number | null = null;

  stageForm: FormGroup;

  constructor(
    private stageService: StageService,
    private fb: FormBuilder
  ) {
    this.stageForm = this.fb.group({
      type: ['', Validators.required],
      domaine: ['', Validators.required],
      entreprise: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      payant: [false],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.fetchStages();
  }

  fetchStages(): void {
    this.stageService.getAllStages().subscribe({
      next: (data) => {
        this.stages = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stages :', err);
        this.isLoading = false;
      }
    });
  }

  openModal(stage?: any): void {
    this.stageForm.reset();
    this.editMode = !!stage;
    this.selectedStageId = stage ? stage.id : null;

    if (stage) {
      this.stageForm.patchValue(stage);
    }

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.stageForm.reset();
    this.editMode = false;
    this.selectedStageId = null;
  }

  onSubmit(): void {
    if (this.stageForm.valid) {
      const formData = { ...this.stageForm.value };
  
      if (this.editMode && this.selectedStageId !== null) {
        this.stageService.updateStage(this.selectedStageId, formData).subscribe({
          next: () => {
            this.fetchStages();
            this.closeModal();
          },
          error: (err) => {
            console.error('Erreur update :', err.error);
          }
        });
      } else {
        delete formData.id; // 🔥 important
        this.stageService.createStage(formData).subscribe({
          next: () => {
            this.fetchStages();
            this.closeModal();
          },
          error: (err) => {
            console.error('Erreur create :', err.error);
            console.log("FormData envoyé :", formData);

          }
        });
      }
    } else {
      console.warn("Formulaire invalide :", this.stageForm.errors);
    }
  }
  
  

  deleteStage(stageId: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce stage ?")) {
      this.stageService.deleteStage(stageId).subscribe({
        next: () => {
          this.fetchStages();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du stage :', err);
        }
      });
    }
  }
}
