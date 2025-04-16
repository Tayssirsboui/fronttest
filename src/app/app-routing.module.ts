import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './front/about/about.component';
import { CoursesComponent } from './front/courses/courses.component';
import { HomeComponent } from './front/home/home.component';
import { FrontLayoutComponent } from './front/front-layout/front-layout.component';
import { BackLayoutComponent } from './back/back-layout/back-layout.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { CourseSingleComponent } from './front/course-single/course-single.component';
import { TeachersComponent } from './front/teachers/teachers.component';
import { EventsComponent } from './front/events/events.component';
import { ContactComponent } from './front/contact/contact.component';
import { ProjetsComponent } from './front/Gestion-Projets/projets/projets.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },
  {
    path: 'front',
    component: FrontLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'projets', component: ProjetsComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contact', component: ContactComponent }



    ]
  },
  { path: '', redirectTo: 'front/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'front/home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
