import { QuizComponent } from './front/quiz/quiz.component';
​import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './front/about/about.component';
import { CoursesComponent } from './front/courses/courses.component';
import { HomeComponent } from './front/home/home.component';
import { FrontLayoutComponent } from './front/front-layout/front-layout.component';
import { BackLayoutComponent } from './back/back-layout/back-layout.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { CourseSingleComponent } from './front/course-single/course-single.component';
import { EventsComponent } from './front/events/events.component';
import { ContactComponent } from './front/contact/contact.component';
import { QuizzesComponent } from './back/quizzes/quizzes.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'quizzes', component: QuizzesComponent, },
    ]
  },
  {
    path: '',
    component: FrontLayoutComponent,  // Removed 'front' path
    children: [
      { path: '', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contact', component: ContactComponent }
    ]
  },
  { path: '', redirectTo: '', pathMatch: 'full' },  // Updated redirect
  { path: '**', redirectTo: '' }  // Updated wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


