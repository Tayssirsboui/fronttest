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
import { CollaborationsComponent } from './front/Gestion-Projets/collaborations/collaborations.component';
import { DashboardKanbanComponent } from './front/Gestion-Projets/dashboard-kanban/dashboard-kanban.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },
  {
    path: '',
    component: FrontLayoutComponent,  // Removed 'front' path
    children: [
      { path: '', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'projets', component: ProjetsComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'collaborations', component: CollaborationsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'kanban', component: DashboardKanbanComponent }

    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },  // Updated redirect
  { path: '**', redirectTo: 'home' }  // Updated wildcard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
