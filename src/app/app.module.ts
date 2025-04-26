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
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuizzesComponent } from './back/quizzes/quizzes.component';
import { BstagesComponent } from './back/bstages/bstages.component';

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
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    
    NgChartsModule,
    ReactiveFormsModule, 
    
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
    FormsModule,
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
  ],
  
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    //HttpClient
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }