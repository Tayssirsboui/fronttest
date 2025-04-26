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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminGestionEvenementsComponent } from './back/admin-gestion-evenements/admin-gestion-evenements.component';
import { StatsEvenementModalComponent } from './back/stats-evenement-modal/stats-evenement-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgChartsModule } from 'ng2-charts';
import { ListeParticipationsComponent } from './back/liste-participations/liste-participations.component';





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
    FooterBackComponent,
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
  
  ],
 
  imports: [
    HttpClientModule,
    BrowserModule,
    
    NgChartsModule,
    ReactiveFormsModule, 
    
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    WebcamModule,
    CodeInputModule,
    NgbModule,
    CommonModule,
    PickerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar:true,
      closeButton:true,
      newestOnTop:true,
      tapToDismiss:true,
      positionClass:'toast-top-right',
      timeOut: 8000,

    }),
    NgChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    FullCalendarModule, 
    FormsModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    NgbModule,
    NgbModalModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    NgxMatNativeDateModule,
    MatDialogModule,
    MatProgressBarModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GoogleMapsModule,
    MatSnackBarModule,
  
    MatDialogModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true
    }),
  ],
  
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    //HttpClient
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }