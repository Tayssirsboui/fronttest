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
import { BlogComponent } from './front/Blogs/blog/blog.component';
import { BlogAdminComponent } from './back/blogs/blog-admin/blog-admin.component';

import { GeminiChatComponent } from './front/Blogs/gemini-chat/gemini-chat.component';
import { BlogDetailsComponent } from './front/Blogs/blog-details/blog-details.component';
import { MesPostsComponent } from './front/Blogs/mes-posts/mes-posts.component';

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'blog', component: BlogAdminComponent },
    ]
  },
  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'blogs', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blog-details/:id', component: BlogDetailsComponent },
      // { path: 'add-post', component: AddPostComponent },
      // { path: 'add-post/:id', component: AddPostComponent },
      { path: 'gemini', component: GeminiChatComponent },
      { path: 'mesPosts', component: MesPostsComponent },



    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
