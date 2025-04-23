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
import { CommunityDetailComponent } from './front/forum/pages/community-detail/community-detail.component';
import { CommunityListComponent } from './front/forum/pages/community-list/community-list.component';
import { CreatePostComponent } from './front/forum/pages/create-post/create-post.component'
import { CreateCommunityComponent } from './front/forum/pages/create-community/create-community.component';

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
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'communities', component: CommunityListComponent },
  { path: 'community/:id', component: CommunityDetailComponent },
  { path: 'create-community', component: CreateCommunityComponent },
  { path: 'community/:id/create-post', component: CreatePostComponent }



    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
 
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
