import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
  
})

export class QuizComponent implements OnInit, OnDestroy {
  tests: any[] = []; // List of all quizzes
  filteredTests: any[] = []; // List of filtered quizzes based on search
  currentTest: any;
  currentQuestionIndex: number = 0;
  quizStarted: boolean = false;
  selectedAnswer: { [questionId: number]: string } = {};
  isQuizAnswered: boolean = false;

  // Timer
  timeLeft: number = 0;
  timerDuration: number = 0;
  timerInterval: any;
  timerColor: string = 'green';

  // Modals
  submissionResult: any = null;
  showSubmissionPopup: boolean = false;
  testResults: any[] = [];
  showResultsModal: boolean = false;

  // Cheating detection
  showCheatingPopup: boolean = false;
  testSubmitted: boolean = false;

  // Search query
  searchQuery: string = '';
  
  // Selected filter for sorting
  selectedFilter: string = 'alphabetic'; // Default filter
  shareUrl: string = 'https://www.example.com/quiz/123';


  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // ➡️ Toast de chargement discret en haut à droite
  // ➡️ Toast de chargement discret (spinner ON au début)
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'info',
    title: 'Chargement des quizz...',
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  this.quizService.getAllTests().subscribe({
    next: (data) => {
      this.tests = data;
      this.filteredTests = [...this.tests];

      // ⏳ Arrêter l'animation de chargement et afficher juste l'icône d'information
      Swal.hideLoading();

      // ✅ Laisser le toast visible encore 3 secondes après le chargement
      setTimeout(() => {
        Swal.close();
      }, 3000);
    },
    error: (error) => {
      console.error('Erreur lors du chargement des quizzes', error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Erreur de chargement',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  });
  }
  

  ngOnDestroy(): void {
    // Cleanup event listener when the component is destroyed
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  // Apply sorting based on selected filter
  applyFilter(): void {
    if (this.selectedFilter === 'alphabetic') {
      this.filteredTests.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.selectedFilter === 'duration') {
      this.filteredTests.sort((a, b) => a.time - b.time);
    }
  }

  // Start a specific test
  startTest(testId: number): void {
    this.quizStarted = true;
    this.currentQuestionIndex = 0;

    this.quizService.getQuestionsByTest(testId).subscribe(data => {
      this.currentTest = data;

      this.timerDuration = (this.currentTest.testDTO.time || 1) * 60;
      this.timeLeft = this.timerDuration;
      this.startTimer();

      // Start listening for tab switching only after the quiz starts
      this.detectTabSwitch();
    });
  }

  // Load test questions when a test is selected
  loadTestQuestions(testId: number): void {
    this.quizService.getQuestionsByTest(testId).subscribe(data => {
      this.currentTest = data;
      this.quizStarted = true;

      this.timerDuration = (this.currentTest.testDTO.time || 1) * 60;
      this.timeLeft = this.timerDuration;
      this.startTimer();

      // Start listening for tab switching only after the quiz starts
      this.detectTabSwitch();
    });
  }

  // Answer a specific question
  answerQuestion(questionId: number, answer: string): void {
    this.selectedAnswer[questionId] = answer;
  }

  // Go to the next question
  nextQuestion(): void {
    const currentId = this.currentTest.questions[this.currentQuestionIndex].id;
    if (!this.selectedAnswer[currentId]) {
      alert("Please select an answer before proceeding.");
      return;
    }

    if (this.currentQuestionIndex < this.currentTest.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  // Submit the test
  submitTest(autoSubmit: boolean = false): void {
    if (!this.currentTest || !this.currentTest.testDTO?.id) {
      console.error('Missing test ID');
      return;
    }
  
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('User not found in localStorage.');
      return;
    }
  
    let fullName: string | null = null;
    let email: string | null = null;
  
    try {
      const parsedUser = JSON.parse(userString);
      fullName = parsedUser.fullName || null;
      email = parsedUser.sub || null; // ⚡ Récupérer l'email depuis `sub`
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      return;
    }
  
    if (!fullName || !email) {
      console.error('Full Name or Email not found in user object.');
      return;
    }
  
    const submitData = {
      testId: this.currentTest.testDTO.id,
      fullName: fullName,
      email: email, // ✅ email correctement lu de `sub`
      responses: Object.keys(this.selectedAnswer).map(questionId => ({
        questionId: +questionId,
        selectedOption: this.selectedAnswer[+questionId]
      }))
    };
  
    const allAnswered = Object.keys(this.selectedAnswer).length === this.currentTest.questions.length;
  
    if (allAnswered || autoSubmit) {
      clearInterval(this.timerInterval);
  
      this.quizService.submitTest(submitData).subscribe({
        next: (response) => {
          this.submissionResult = response;
          this.showSubmissionPopup = true;
          this.isQuizAnswered = true;
          this.quizStarted = false;
        },
        error: (error) => {
          console.error('Submission error:', error);
        }
      });
    } else if (!autoSubmit) {
      alert('Please answer all questions before submitting.');
    }
  }
  
  

  closePopup(): void {
    this.showSubmissionPopup = false;
    this.router.navigate(['/quiz']);
  }

  // Start the quiz timer
  startTimer(): void {
    this.updateTimerColor();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateTimerColor();
      } else {
        clearInterval(this.timerInterval);
        this.submitTest(true);
      }
    }, 1000);
  }

  // Update the timer color based on remaining time
  updateTimerColor(): void {
    const percentLeft = (this.timeLeft / this.timerDuration) * 100;
    if (percentLeft <= 10) {
      this.timerColor = 'red';
    } else if (percentLeft <= 50) {
      this.timerColor = 'orange';
    } else {
      this.timerColor = 'green';
    }
  }

  // Get formatted time for the timer
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  // Pad single digit numbers with a leading zero
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  // Get the circumference of the timer circle
  get circumference(): number {
    return 2 * Math.PI * 45;
  }

  // Get the progress offset for the timer circle
  get progressOffset(): number {
    return this.circumference * (1 - this.timeLeft / this.timerDuration);
  }

  // View all results in a modal
  viewAllResults(): void {
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('No user info found in localStorage.');
      return;
    }
  
    try {
      const parsedUser = JSON.parse(userString);
      const fullName = parsedUser.fullName;
  
      this.quizService.getTestResults(fullName).subscribe({
        next: (results) => {
          this.testResults = results;
          this.showResultsModal = true;
        },
        error: (error) => {
          console.error('Error loading user test results', error);
        }
      });
  
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
    }
  }
  

  closeResultsModal(): void {
    this.showResultsModal = false;
  }

  // Cheating detection: Listen for tab switching or window minimize
  detectTabSwitch() {
    if (this.quizStarted) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  // Handle tab switching or window minimize
  handleVisibilityChange() {
    if (document.hidden && this.quizStarted && !this.testSubmitted) {
      // User switched tab or minimized the window
      this.showCheatingPopup = true;
      setTimeout(() => {
        this.submitTest(true); // Auto-submit after showing the cheating popup
      }, 2000); // Delay the auto-submit to allow time for the popup to show
    }
  }

  closeCheatingPopup() {
    this.showCheatingPopup = false;
  }

  // Search quizzes based on user input
  searchQuiz() {
    if (this.searchQuery) {
      this.filteredTests = this.tests.filter(test =>
        test.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredTests = [...this.tests]; // If no search query, show all quizzes
    }
  }
  get facebookShareLink(): string {
    const baseUrl = 'https://www.facebook.com/sharer/sharer.php';
    const url = encodeURIComponent(this.shareUrl); // Required URL
    const quote = encodeURIComponent(
      `🎉 J'ai terminé le quizz "${this.currentTest?.testDTO?.title}" avec un score de ${this.submissionResult?.percentage}% (${this.submissionResult?.correctAnswers} réponses correctes). Testez vos connaissances maintenant !`
    );
    return `${baseUrl}?u=${url}&quote=${quote}`;
  }
  get twitterShareLink(): string {
    const quizTitle = this.currentTest?.testDTO?.title || 'un quiz';
    const score = this.submissionResult?.percentage || 0;
    const correct = this.submissionResult?.correctAnswers || 0;
    const baseUrl = 'https://twitter.com/intent/tweet';
  
    const text = encodeURIComponent(
      `🎉 J'ai terminé le quiz "${quizTitle}" avec un score de ${score}% (${correct} bonnes réponses) !`
    );
    const url = encodeURIComponent(this.shareUrl); // make sure this is the link to your quiz or result
  
    return `${baseUrl}?text=${text}&url=${url}`;
  }
  
}
