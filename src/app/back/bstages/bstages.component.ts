import { Component } from '@angular/core';
import { StageService } from '../../../services/stage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

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
        Swal.fire('Erreur', 'Erreur lors du chargement des stages.', 'error');
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
            Swal.fire('Succès', 'Stage modifié avec succès.', 'success');
          },
          error: (err) => {
            console.error('Erreur update :', err.error);
            Swal.fire('Erreur', 'Erreur lors de la modification du stage.', 'error');
          }
        });
      } else {
        delete formData.id; // 🔥 important
        this.stageService.createStage(formData).subscribe({
          next: () => {
            this.fetchStages();
            this.closeModal();
            Swal.fire('Succès', 'Stage ajouté avec succès.', 'success');
          },
          error: (err) => {
            console.error('Erreur create :', err.error);
            console.log("FormData envoyé :", formData);
            Swal.fire('Erreur', 'Erreur lors de l\'ajout du stage.', 'error');
          }
        });
      }
    } else {
      console.warn("Formulaire invalide :", this.stageForm.errors);
      Swal.fire('Attention', 'Veuillez remplir correctement le formulaire.', 'warning');
    }
  }

  deleteStage(stageId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stageService.deleteStage(stageId).subscribe({
          next: () => {
            this.fetchStages();
            Swal.fire('Supprimé !', 'Le stage a été supprimé.', 'success');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du stage :', err);
            Swal.fire('Erreur', 'Erreur lors de la suppression du stage.', 'error');
          }
        });
      }
    });
  }
}
