import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { HomeComponent } from './front/home/home.component';
import { NavbarComponent } from './front/navbar/navbar.component';
import { AboutComponent } from './front/about/about.component';
import { CoursesComponent } from './front/courses/courses.component';
import { FooterBackComponent } from './back/footer-back/footer-back.component';
import { SidebarBackComponent } from './back/sidebar-back/sidebar-back.component';
import { BackLayoutComponent } from './back/back-layout/back-layout.component';
import { FrontLayoutComponent } from './front/front-layout/front-layout.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';
import { HeaderBackComponent } from './back/header-back/header-back.component';
import { SamplePageComponent } from './back/sample-page/sample-page.component';
import { StagesComponent } from './front/stages/stages.component';
import { CourseSingleComponent } from './front/course-single/course-single.component';
import { QuizComponent } from './front/quiz/quiz.component';
import { ContactComponent } from './front/contact/contact.component';
import { LoginFrontComponent } from './front/login-front/login-front.component';
import { RegisterFrontComponent } from './front/register-front/register-front.component';
import { ActivateAcountComponent } from './activate-acount/activate-acount.component';
import { CodeInputModule } from 'angular-code-input';
import {  HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserListComponent } from './back/user-list/user-list.component';
import { ProfilComponent } from './front/profil/profil.component';
import { WebcamComponent } from './front/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam';
import { ForgotPasswordComponent } from './front/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './front/reset-password/reset-password.component'; // Import WebcamModule
import { TokenInterceptor } from './tokenInterceptor';



import { BlogComponent } from './front/Blogs/blog/blog.component';
import { BlogDetailsComponent } from './front/Blogs/blog-details/blog-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { GeminiChatComponent } from './front/Blogs/gemini-chat/gemini-chat.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { BlogAdminComponent } from './back/blogs/blog-admin/blog-admin.component';
import { MesPostsComponent } from './front/Blogs/mes-posts/mes-posts.component';
import { NgChartsModule } from 'ng2-charts';
import { StatPostsComponent } from './back/blogs/stat-posts/stat-posts.component';
import { QuizzesComponent } from './back/quizzes/quizzes.component';
import { BstagesComponent } from './back/bstages/bstages.component';
import { EvenementListComponent } from './front/gestion-evenements/evenement-list/evenement-list.component';
import { EvenementDetailComponent } from './front/gestion-evenements/evenement-detail/evenement-detail.component';
import { ParticipationModalComponent } from './front/gestion-evenements/participation-modal/participation-modal.component';
import { EvenementModifierComponent } from './front/gestion-evenements/evenement-modifier/evenement-modifier.component';
import { EvenementModalComponent } from './front/gestion-evenements/evenement-modal/evenement-modal.component';
import { ListeAttenteModalComponent } from './front/gestion-evenements/liste-attente-modal/liste-attente-modal.component';
import { CalendrierUtilisateurComponent } from './front/gestion-evenements/calendrier-utilisateur/calendrier-utilisateur.component';
import { EvenementDetailsModalComponent } from './front/gestion-evenements/evenement-details-modal/evenement-details-modal.component';


import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminGestionEvenementsComponent } from './back/admin-gestion-evenements/admin-gestion-evenements.component';
import { StatsEvenementModalComponent } from './back/stats-evenement-modal/stats-evenement-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ListeParticipationsComponent } from './back/liste-participations/liste-participations.component';
import { ListProjetsComponent } from './back/Gestion-Projets/list-projets/list-projets.component';
import { AjouterCollaborationComponent } from './front/Gestion-Projets/ajouter-collaboration/ajouter-collaboration.component';
import { AjouterProjetComponent } from './front/Gestion-Projets/ajouter-projet/ajouter-projet.component';
import { CollaborationsComponent } from './front/Gestion-Projets/collaborations/collaborations.component';
import { DashboardKanbanComponent } from './front/Gestion-Projets/dashboard-kanban/dashboard-kanban.component';
import { ProjetsComponent } from './front/Gestion-Projets/projets/projets.component';
import { RoadmapModalComponent } from './front/Gestion-Projets/roadmap-modal/roadmap-modal.component';
import { FilterPipe } from './front/Gestion-Projets/shared/filter.pipe';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';

import { CommunityDetailComponent } from './front/forum/pages/community-detail/community-detail.component';
import { CommunityListComponent } from './front/forum/pages/community-list/community-list.component';
import { CreatePostComponent } from './front/forum/pages/create-post/create-post.component'
import { CreateCommunityComponent } from './front/forum/pages/create-community/create-community.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

import { MatSnackBarModule } from '@angular/material/snack-bar';


import { AddCategorieComponent } from './front/add-categorie/add-categorie.component';
import { RessourcesComponent } from './front/ressources/ressources.component';
import { AjoutRessourcesComponent } from './front/ajout-ressources/ajout-ressources.component';
import { DetailRessourceComponent } from './front/detail-ressource/detail-ressource.component';
import { ConfirmationDialogComponent } from './front/shared/confirmation-dialog/confirmation-dialog.component';

import { MatRadioModule } from '@angular/material/radio';

import { MatListModule } from '@angular/material/list';

import { MatGridListModule } from '@angular/material/grid-list';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AffichageCategorieComponent } from './front/affichage-categorie/affichage-categorie.component';



@NgModule({
  
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    NavbarComponent,
    AboutComponent,
    CoursesComponent,
    FooterBackComponent,
    SidebarBackComponent,
    CommunityDetailComponent,
    CreateCommunityComponent,
    HomeComponent,
    CommunityListComponent,
    CreatePostComponent,
    BackLayoutComponent,
    FrontLayoutComponent,
    DashboardComponent,
    HeaderBackComponent,
    SamplePageComponent,
    StagesComponent,
    EvenementModifierComponent,
    ParticipationModalComponent,
    CourseSingleComponent,
    QuizComponent,
    ContactComponent,
    QuizzesComponent,
    BstagesComponent,
    BlogComponent,
    BlogDetailsComponent,
    GeminiChatComponent,
    BlogAdminComponent,
    MesPostsComponent,
    StatPostsComponent,
    LoginFrontComponent,
    RegisterFrontComponent,
    ActivateAcountComponent,
    UserListComponent,
    ProfilComponent,
    WebcamComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    EvenementListComponent,
    EvenementDetailComponent,
    EvenementModalComponent,
    
    ListeAttenteModalComponent,
    CalendrierUtilisateurComponent,
    EvenementDetailsModalComponent,
    AdminGestionEvenementsComponent,
    StatsEvenementModalComponent,
    ListeParticipationsComponent,
    ProjetsComponent,
    FilterPipe,
    AjouterCollaborationComponent,
    AjouterProjetComponent,
    CollaborationsComponent,
    DashboardKanbanComponent,
    RoadmapModalComponent,
    ListProjetsComponent,
    SafeUrlPipe,
    AffichageCategorieComponent,
   
    AddCategorieComponent,
    RessourcesComponent,
    AjoutRessourcesComponent,
    DetailRessourceComponent,
    ConfirmationDialogComponent,
  ],
 
  imports: [
  HttpClientModule,
  BrowserModule,
  NgChartsModule,
  ReactiveFormsModule,
  AppRoutingModule,
  FormsModule,
  WebcamModule,
  CodeInputModule,
  NgbModule,
  CommonModule,
  PickerModule,
  BrowserAnimationsModule,
  ToastrModule.forRoot({
    progressBar: true,
    closeButton: true,
    newestOnTop: true,
    tapToDismiss: true,
    positionClass: 'toast-top-right',
    timeOut: 8000,
  }),
  RouterModule,
  FullCalendarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  NgbModalModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatMomentModule,
  NgxMatNativeDateModule,
  MatProgressBarModule,
  MatDividerModule,
  MatCardModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  GoogleMapsModule,
  MatSnackBarModule,
  MatPaginatorModule,
  KanbanModule,
   PickerModule,
   BrowserModule,
   AppRoutingModule,
   BrowserAnimationsModule,
   HttpClientModule,
   FormsModule, 
   ReactiveFormsModule,
   MatListModule,
   MatGridListModule,
   PdfViewerModule
      
   
  ],
  
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    //HttpClient
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }