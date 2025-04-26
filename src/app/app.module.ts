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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AffichageCategorieComponent } from './front/affichage-categorie/affichage-categorie.component';

import { AddCategorieComponent } from './front/add-categorie/add-categorie.component';
import { RessourcesComponent } from './front/ressources/ressources.component';
import { AjoutRessourcesComponent } from './front/ajout-ressources/ajout-ressources.component';
import { DetailRessourceComponent } from './front/detail-ressource/detail-ressource.component';
import { ConfirmationDialogComponent } from './front/shared/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Importer ici
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';

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
    AffichageCategorieComponent,
   
    AddCategorieComponent,
    RessourcesComponent,
    AjoutRessourcesComponent,
    DetailRessourceComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
        // Material Modules
        MatSnackBarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatButtonModule,
        MatPaginatorModule,
        // Third-party Modules
        PdfViewerModule,
       
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
