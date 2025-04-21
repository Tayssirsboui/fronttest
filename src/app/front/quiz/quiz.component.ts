import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuizService } from '../../../services/quiz.service';
import { Router, ActivatedRoute } from '@angular/router';

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
    // Get all quizzes
    this.quizService.getAllTests().subscribe(data => {
      this.tests = data;
      this.filteredTests = [...this.tests]; // Initialize filteredTests with all quizzes
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
      this.router.navigate([`/quiz/${testId}`]);

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

    const submitData = {
      testId: this.currentTest.testDTO.id,
      responses: Object.keys(this.selectedAnswer).map(questionId => ({
        questionId: +questionId,
        selectedOption: this.selectedAnswer[+questionId]
      }))
    };

    const allAnswered = Object.keys(this.selectedAnswer).length === this.currentTest.questions.length;

    if (allAnswered || autoSubmit) {
      clearInterval(this.timerInterval);
      this.quizService.submitTest(submitData).subscribe(response => {
        this.submissionResult = response;
        this.showSubmissionPopup = true;
        this.isQuizAnswered = true;
        this.quizStarted = false;
      }, error => {
        console.error('Submission error:', error);
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
    this.quizService.getTestResults().subscribe(results => {
      this.testResults = results;
      this.showResultsModal = true;
    });
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
}
