import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../../services/quiz.service'; // Corrected import path
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent implements OnInit {
  quizzes: any[] = [];
  filteredQuizzes: any[] = []; // This will hold the filtered quizzes based on search
  newTest: any = { title: '', description: '', time: 0 };
  newQuestion: any = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' };
  showCreateTestModal: boolean = false;
  showAddQuestionModal: boolean = false;
  currentTestId?: number;
  isSubmitting: boolean = false;

  // Variables to hold selected test and modal visibility
  selectedTest: any;
  showQuestionsModal: boolean = false;

  // For AI-generated questions
  generatedQuestions: any[] = [];
  showGeneratedQuestionsModal: boolean = false; // Flag to show the modal

  // Popup success flag and tick animation toggle
  showSuccessPopup: boolean = false;
  successMessage: string = '';
  showTickAnimation: boolean = false;  // This controls the tick animation

  showDeletePopup: boolean = false;  // New flag for delete success
  deleteMessage: string = '';  // Message for delete success

  searchQuery: string = ''; // This holds the search query

  constructor(private quizService: QuizService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  // Fetch quizzes from backend
  fetchQuizzes(): void {
    this.quizService.getAllTests().subscribe(
      (data: any[]) => {
        this.quizzes = data; // Update quizzes list
        this.filteredQuizzes = this.quizzes; // Initially show all quizzes
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }

  // Method to search quizzes based on the search query
  searchQuizzes(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredQuizzes = this.quizzes; // Show all quizzes if search is empty
    } else {
      this.filteredQuizzes = this.quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  generateQuestions(description: string): void {
    this.quizService.generateQuestions(description).subscribe({
      next: (res) => {
        console.log('🧠 AI Response:', res);
        this.showGeneratedQuestionsModal = true;

  
        if (res && Array.isArray(res.questions)) {
          this.generatedQuestions = res.questions;
  
          // Active l'affichage une fois les données réellement prêtes
        
        
        } 
        else if (res && res.error) {
          console.error('⚠️ Erreur côté AI :', res.error);
        } 
        else {
          console.warn('⚠️ Réponse inattendue :', res);
        }
      },
      error: (err) => {
        console.error('❌ Erreur HTTP vers Flask API :', err);
      }
    });
  }
  



  
  
  // Close the modal displaying generated questions
  closeGeneratedQuestionsModal(): void {
    this.showGeneratedQuestionsModal = false;
  }

  // Other existing methods...

  // Open the modal for creating a new test
  openCreateTestModal(): void {
    this.showCreateTestModal = true;
    this.newTest = { title: '', description: '', time: 0 }; // Reset form data when opening the modal
  }

  // Close the modal for creating a new test
  closeModal(): void {
    this.showCreateTestModal = false;
  }

  // Method to submit the new test to the backend
  createTest(): void {
    if (this.isValidForm()) {
      this.isSubmitting = true;
      this.quizService.createTest(this.newTest).subscribe(
        (response) => {
          console.log('Test created successfully', response);
          this.fetchQuizzes(); // Refresh the quiz list after the test is created
          this.closeModal(); // Close the modal after submission
          this.isSubmitting = false;

          // Show success popup and trigger tick animation for create
          this.successMessage = "Test created successfully!";
          this.showSuccessPopup = true;
          this.showTickAnimation = true;

          // Hide the popup after 3 seconds
          setTimeout(() => {
            this.showSuccessPopup = false;
            this.showTickAnimation = false;
          }, 3000);
        },
        (error) => {
          console.error('Error creating test:', error);
          alert('An error occurred while creating the test.');
          this.isSubmitting = false;
        }
      );
    } else {
      console.error('Form is invalid');
      alert('Please fill in all fields correctly');
    }
  }

  // Form validation to check if required fields are filled for creating a test
  isValidForm(): boolean {
    return this.newTest.title.trim() !== '' && 
           this.newTest.description.trim() !== '' && 
           this.newTest.time > 0;
  }

  // Method to delete a quiz
  deleteQuiz(testId: number): void {
    if (confirm("Are you sure you want to delete this quiz?")) {
      this.quizService.deleteTest(testId).subscribe(
        (response: string) => { // Expecting a plain text response
          console.log('Quiz deleted successfully', response);
          
          // After deletion, refresh the list of quizzes
          this.fetchQuizzes();

          // Show success popup and trigger tick animation for delete
          this.deleteMessage = "Quiz deleted successfully!";
          this.showDeletePopup = true;
          this.showTickAnimation = true;

          // Hide the popup after 3 seconds
          setTimeout(() => {
            this.showDeletePopup = false;
            this.showTickAnimation = false;
          }, 3000);
        },
        (error) => {
          console.error('Error deleting quiz:', error);
          alert('Error deleting quiz');
        }
      );
    }
  }

  // Open modal to add a new question to the selected test
  openAddQuestionModal(testId: number): void {
    this.showAddQuestionModal = true;
    this.newQuestion = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' };
    this.currentTestId = testId; // Store the testId to add a question to the specific test
  }

  // Close the add question modal
  closeAddQuestionModal(): void {
    this.showAddQuestionModal = false;
  }

  // Method to add a new question to the selected test
  addQuestion(): void {
    if (this.isValidQuestion()) {
      const questionData = {
        id: this.currentTestId,  // Make sure to pass the correct testId here
        questionText: this.newQuestion.questionText,
        optionA: this.newQuestion.optionA,
        optionB: this.newQuestion.optionB,
        optionC: this.newQuestion.optionC,
        optionD: this.newQuestion.optionD,
        correctOption: this.newQuestion.correctOption
      };

      console.log("Current test ID:", this.currentTestId);  // Ensure it's a valid number

      this.quizService.addQuestionToTest(questionData).subscribe(
        (response) => {
          console.log('Question added successfully', response);
          this.fetchQuizzes(); // Refresh the quiz list after adding the question
          this.closeAddQuestionModal();
        },
        (error) => {
          console.error('Error adding question:', error);
          alert('Error adding question');
        }
      );
    } else {
      alert('Please fill in all fields correctly');
    }
  }

  // Form validation for adding a new question
  isValidQuestion(): boolean {
    return this.newQuestion.questionText.trim() !== '' &&
           this.newQuestion.optionA.trim() !== '' &&
           this.newQuestion.optionB.trim() !== '' &&
           this.newQuestion.optionC.trim() !== '' &&
           this.newQuestion.optionD.trim() !== '' &&
           this.newQuestion.correctOption.trim() !== '';
  }

  // Open modal to view questions for the selected test
  openViewQuestionsModal(testId: number): void {
    this.quizService.getQuestionsByTest(testId).subscribe(
      (data: any) => {
        this.selectedTest = data; // Set selected test and questions
        this.showQuestionsModal = true; // Show modal
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  // Close the modal for viewing questions
  closeQuestionsModal(): void {
    this.showQuestionsModal = false;
  }
}
