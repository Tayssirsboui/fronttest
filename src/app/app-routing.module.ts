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

const routes: Routes = [
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'listuser', component: UserListComponent },
      { path: 'blog', component: BlogAdminComponent },
    ]
  },
  {
    path: '',
   
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'cam', component: WebcamComponent },

      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'course-single', component: CourseSingleComponent },
      { path: 'events', component: EventsComponent },
      { path: 'contact', component: ContactComponent }
      { path: 'blogs', component: BlogComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blog-details/:id', component: BlogDetailsComponent },
      // { path: 'add-post', component: AddPostComponent },
      // { path: 'add-post/:id', component: AddPostComponent },
      { path: 'gemini', component: GeminiChatComponent },
      { path: 'mesPosts', component: MesPostsComponent },
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

{ path: 'reset-password', component: ResetPasswordComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
