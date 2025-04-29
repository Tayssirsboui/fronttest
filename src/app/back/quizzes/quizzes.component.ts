import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent implements OnInit {
  quizzes: any[] = [];
  filteredQuizzes: any[] = [];
  newTest: any = { title: '', description: '', time: 0 };
  newQuestion: any = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' };
  showCreateTestModal = false;
  showAddQuestionModal = false;
  currentTestId?: number;
  isSubmitting = false;

  selectedTest: any;
  showQuestionsModal = false;

  generatedQuestions: {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
  }[] = [];

  showGeneratedQuestionsModal = false;
  generatedQuestionQuizId: number | null = null;

  showSuccessPopup = false;
  successMessage = '';
  showTickAnimation = false;

  showDeletePopup = false;
  deleteMessage = '';
  searchQuery = '';
  showGeneratedSuccessPopup = false;
  showStatisticsModal = false;
  statisticsData: any = null;

  constructor(private quizService: QuizService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    this.quizService.getAllTests().subscribe({
      next: (data) => {
        this.quizzes = data;
        this.filteredQuizzes = this.quizzes;
      },
      error: (error) => console.error('Error fetching quizzes:', error)
    });
  }

  searchQuizzes(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredQuizzes = query
      ? this.quizzes.filter(quiz => quiz.title.toLowerCase().includes(query) || quiz.description.toLowerCase().includes(query))
      : this.quizzes;
  }

  generateQuestions(description: string, quizId: number): void {
    this.quizService.generateQuestions(description).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.questions)) {
          this.generatedQuestions = res.questions;
          this.generatedQuestionQuizId = quizId;
          this.showGeneratedQuestionsModal = true;
          this.showGeneratedSuccessPopup = true;
          Swal.fire({
            icon: 'success',
            title: 'Questions générées avec succès !',
            toast: true,
            position: 'top-end',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        } else {
          console.warn('⚠️ Unexpected AI response:', res);
        }
      },
      error: (err) => {
        console.error('❌ AI API error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur génération questions',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }
  renderPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
  
    if (!ctx) {
      console.error('Canvas for PieChart not found!');
      return;
    }
  
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Réponses Correctes', 'Réponses Fausses'],
        datasets: [{
          data: [this.statisticsData.correctAnswers, this.statisticsData.wrongAnswers],
          backgroundColor: ['#4CAF50', '#F44336'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  

  closeGeneratedQuestionsModal(): void {
    this.showGeneratedQuestionsModal = false;
  }

  openCreateTestModal(): void {
    this.newTest = { title: '', description: '', time: 0 };
    this.showCreateTestModal = true;
  }

  closeModal(): void {
    this.showCreateTestModal = false;
  }

  createTest(): void {
    if (!this.isValidForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs invalides',
        text: 'Veuillez remplir tous les champs correctement.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    this.isSubmitting = true;
    this.quizService.createTest(this.newTest).subscribe({
      next: (response) => {
        this.fetchQuizzes();
        this.closeModal();
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: 'Test créé avec succès !',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Error creating test:', error);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur création test',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }

  deleteQuiz(testId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.quizService.deleteTest(testId).subscribe({
          next: () => {
            this.fetchQuizzes();
            Swal.fire({
              icon: 'success',
              title: 'Quiz supprimé avec succès !',
              toast: true,
              position: 'top-end',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error deleting quiz:', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur suppression quiz',
              toast: true,
              position: 'top-end',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }
        });
      }
    });
  }

  openAddQuestionModal(testId: number): void {
    this.currentTestId = testId;
    this.newQuestion = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' };
    this.showAddQuestionModal = true;
  }

  closeAddQuestionModal(): void {
    this.showAddQuestionModal = false;
  }

  addQuestion(): void {
    if (!this.isValidQuestion()) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs invalides',
        text: 'Veuillez remplir toutes les options.',
        toast: true,
        position: 'top-end',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const questionData = {
      id: this.currentTestId,
      ...this.newQuestion
    };

    this.quizService.addQuestionToTest(questionData).subscribe({
      next: () => {
        this.fetchQuizzes();
        this.closeAddQuestionModal();
        Swal.fire({
          icon: 'success',
          title: 'Question ajoutée avec succès !',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('Error adding question:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur ajout question',
          toast: true,
          position: 'top-end',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }

  addGeneratedQuestionToQuiz(question: {
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
  }, testId: number): void {
    this.newQuestion = { ...question };
    this.currentTestId = testId;
    this.showAddQuestionModal = true;
    this.showGeneratedQuestionsModal = false;
  }

  isValidForm(): boolean {
    return !!(this.newTest.title.trim() && this.newTest.description.trim());
  }

  isValidQuestion(): boolean {
    const q = this.newQuestion;
    return q.questionText && q.optionA && q.optionB && q.optionC && q.optionD && q.correctOption;
  }

  openViewQuestionsModal(testId: number): void {
    this.quizService.getQuestionsByTest(testId).subscribe({
      next: (data) => {
        this.selectedTest = data;
        this.showQuestionsModal = true;
      },
      error: (error) => console.error('Error fetching questions:', error)
    });
  }

  closeQuestionsModal(): void {
    this.showQuestionsModal = false;
  }
  openStatisticsModal(): void {
    this.quizService.getStatistics().subscribe({
      next: (data) => {
        this.statisticsData = data;
        this.showStatisticsModal = true;
  
        // ⚡ Important : petit timeout pour laisser Angular afficher le canvas
        setTimeout(() => {
          this.renderPieChart();
        }, 0);
      },
      error: (err) => {
        console.error('Erreur chargement stats:', err);
      }
    });
  }
  

  closeStatisticsModal(): void {
    this.showStatisticsModal = false;
  }
}
