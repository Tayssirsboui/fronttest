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
import { ProjetsComponent } from './front/Gestion-Projets/projets/projets.component';
import { AjouterCollaborationComponent } from './front/Gestion-Projets/ajouter-collaboration/ajouter-collaboration.component';
import { AjouterProjetComponent } from './front/Gestion-Projets/ajouter-projet/ajouter-projet.component';
import { CollaborationsComponent } from './front/Gestion-Projets/collaborations/collaborations.component';
import { FilterPipe } from './front/Gestion-Projets/shared/filter.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import {  MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { DashboardKanbanComponent } from './front/Gestion-Projets/dashboard-kanban/dashboard-kanban.component';
import { RoadmapModalComponent } from './front/Gestion-Projets/roadmap-modal/roadmap-modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
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
    ProjetsComponent,
    FilterPipe,
    AjouterCollaborationComponent,
    AjouterProjetComponent,
    CollaborationsComponent,
    DashboardKanbanComponent,
    RoadmapModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSnackBarModule,
    KanbanModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule


  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
