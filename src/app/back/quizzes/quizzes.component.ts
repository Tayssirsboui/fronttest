import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

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
        } else {
          console.warn('⚠️ Unexpected AI response:', res);
        }
      },
      error: (err) => console.error('❌ AI API error:', err)
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
      alert('Please fill in all fields correctly');
      return;
    }

    this.isSubmitting = true;
    this.quizService.createTest(this.newTest).subscribe({
      next: (response) => {
        this.fetchQuizzes();
        this.closeModal();
        this.isSubmitting = false;
        this.successMessage = 'Test created successfully!';
        this.showSuccessPopup = true;
        this.showTickAnimation = true;
        setTimeout(() => {
          this.showSuccessPopup = false;
          this.showTickAnimation = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error creating test:', error);
        alert('An error occurred while creating the test.');
        this.isSubmitting = false;
      }
    });
  }

  deleteQuiz(testId: number): void {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    this.quizService.deleteTest(testId).subscribe({
      next: () => {
        this.fetchQuizzes();
        this.deleteMessage = "Quiz deleted successfully!";
        this.showDeletePopup = true;
        this.showTickAnimation = true;
        setTimeout(() => {
          this.showDeletePopup = false;
          this.showTickAnimation = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error deleting quiz:', error);
        alert('Error deleting quiz');
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
      alert('Please fill in all fields correctly');
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
      },
      error: (error) => {
        console.error('Error adding question:', error);
        alert('Error adding question');
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
    return !!(this.newTest.title.trim() && this.newTest.description.trim() && this.newTest.time > 0);
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
}
