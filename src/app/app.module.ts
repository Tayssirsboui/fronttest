import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FormsModule } from '@angular/forms';
import { CommunityDetailComponent } from './front/forum/pages/community-detail/community-detail.component';
import { CommunityListComponent } from './front/forum/pages/community-list/community-list.component';
import { CreatePostComponent } from './front/forum/pages/create-post/create-post.component'
import { CreateCommunityComponent } from './front/forum/pages/create-community/create-community.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SafeUrlPipe } from './pipes/safe-url.pipe';






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
    EventsComponent,
    CourseSingleComponent,
    TeachersComponent,
    SafeUrlPipe,

    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,  
    PickerModule,


  ],
  providers: [{provide: LocationStrategy,useClass:HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
