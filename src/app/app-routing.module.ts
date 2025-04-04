import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './front/about/about.component';
import { CoursesComponent } from './front/courses/courses.component';
import { HomeComponent } from './front/home/home.component';





const routes: Routes = [
  { path: '', component: HomeComponent }, 
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
