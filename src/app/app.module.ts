import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { BlogComponent } from './front/Blogs/blog/blog.component';
import { BlogDetailsComponent } from './front/Blogs/blog-details/blog-details.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { GeminiChatComponent } from './front/Blogs/gemini-chat/gemini-chat.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogAdminComponent } from './back/blogs/blog-admin/blog-admin.component';
import { MesPostsComponent } from './front/Blogs/mes-posts/mes-posts.component';
import { NgChartsModule } from 'ng2-charts';
import { StatPostsComponent } from './back/blogs/stat-posts/stat-posts.component';

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
    
    BlogComponent,
    BlogDetailsComponent,
    FooterBackComponent,
    GeminiChatComponent,
    BlogAdminComponent,
    MesPostsComponent,
    StatPostsComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    ReactiveFormsModule, 
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
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
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
