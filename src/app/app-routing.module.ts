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
import { StagesComponent } from './front/stages/stages.component';

import { ContactComponent } from './front/contact/contact.component';
import { LoginFrontComponent } from './front/login-front/login-front.component';
import { RegisterFrontComponent } from './front/register-front/register-front.component';
import { ActivateAcountComponent } from './activate-acount/activate-acount.component';
import { UserListComponent } from './back/user-list/user-list.component';
import { ProfilComponent } from './front/profil/profil.component';
import { AuthGuard } from './front/guards/auth.guard';
import { WebcamComponent } from './front/webcam/webcam.component';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component';

import { BlogComponent } from './front/Blogs/blog/blog.component';
import { BlogAdminComponent } from './back/blogs/blog-admin/blog-admin.component';

import { GeminiChatComponent } from './front/Blogs/gemini-chat/gemini-chat.component';
import { BlogDetailsComponent } from './front/Blogs/blog-details/blog-details.component';
import { MesPostsComponent } from './front/Blogs/mes-posts/mes-posts.component';
import { QuizzesComponent } from './back/quizzes/quizzes.component';
import { BstagesComponent } from './back/bstages/bstages.component';
import { EvenementListComponent } from './front/gestion-evenements/evenement-list/evenement-list.component';
import { CalendrierUtilisateurComponent } from './front/gestion-evenements/calendrier-utilisateur/calendrier-utilisateur.component';
import { AdminGestionEvenementsComponent } from './back/admin-gestion-evenements/admin-gestion-evenements.component';
import { ListeParticipationsComponent } from './back/liste-participations/liste-participations.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'listuser', component: UserListComponent },
      { path: 'blog', component: BlogAdminComponent },
      { path: 'quizzes', component: QuizzesComponent, },
      { path: 'bstage', component: BstagesComponent, },
      {path:'evenement', component: AdminGestionEvenementsComponent},
      {path:'participation', component: ListeParticipationsComponent}
    ]
  },
  {
    path: '',
   
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'cam', component: WebcamComponent },

      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'quiz/:id', component: QuizComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blogs', component: BlogComponent },
      { path: 'blog-details/:id', component: BlogDetailsComponent },
      { path: 'gemini', component: GeminiChatComponent },
      { path: 'mesPosts', component: MesPostsComponent },
      { path: 'stages', component: StagesComponent },
      { path: 'evenement', component: EvenementListComponent },
      { path: 'calendrier', component: CalendrierUtilisateurComponent },

      {
        path: 'profil', component: ProfilComponent,
        canActivate: [AuthGuard]
      },
      { path: 'login', component: LoginFrontComponent },
      { path: 'register', component: RegisterFrontComponent },
      { path: 'activate-acount', component: ActivateAcountComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },

    ]
    
  },

// { path: 'reset-password', component: ResetPasswordComponent },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }


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
import { ListProjetsComponent } from './back/Gestion-Projets/list-projets/list-projets.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'projets', component: ListProjetsComponent },
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
      { path: 'kanban/:id', component: DashboardKanbanComponent }

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
