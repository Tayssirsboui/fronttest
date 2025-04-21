import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8222/quiz/api/test';  // Backend URL (adjust if needed)

  constructor(private http: HttpClient) { }

  // Fetch all tests
  getAllTests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  // Fetch all questions for a specific test
  getQuestionsByTest(testId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${testId}`);
  }

  // Submit the test answers
  submitTest(quizData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-test`, quizData);
  }

  // Fetch all test results
  getTestResults(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test-result`);
  }
  // create test new 
  createTest(testData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, testData);
  }
  addQuestionToTest(questionData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/question`, questionData).pipe(
      catchError((error) => {
        console.error('Error adding question:', error);  // Log the error
        return throwError(() => new Error(error.message));
      })
    );
  }

  deleteTest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/test/${id}`, { responseType: 'text' }); 
    // We set the responseType to 'text' instead of 'json'
  }

  generateQuestions(description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-questions`, { description });
  }
  
  
  
}
