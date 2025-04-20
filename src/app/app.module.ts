import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS,HttpClient, HttpClientModule } from '@angular/common/http';
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
import { EventsComponent } from './front/events/events.component';
import { CourseSingleComponent } from './front/course-single/course-single.component';
import { TeachersComponent } from './front/teachers/teachers.component';
import { ContactComponent } from './front/contact/contact.component';
import { LoginFrontComponent } from './front/login-front/login-front.component';
import { RegisterFrontComponent } from './front/register-front/register-front.component';
import { ActivateAcountComponent } from './activate-acount/activate-acount.component';
import { CodeInputModule } from 'angular-code-input';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UserListComponent } from './back/user-list/user-list.component';
import { ProfilComponent } from './front/profil/profil.component';
import { WebcamComponent } from './front/webcam/webcam.component';
import { WebcamModule } from 'ngx-webcam'; // Import WebcamModule



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
    EventsComponent,
    CourseSingleComponent,
    TeachersComponent,
    ContactComponent,
    LoginFrontComponent,
    RegisterFrontComponent,
    ActivateAcountComponent,
    UserListComponent,
    ProfilComponent,
    WebcamComponent,

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    WebcamModule, 
    CodeInputModule

    
   ],
  providers: [ {provide: LocationStrategy,useClass:HashLocationStrategy},
    HttpClient,
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
