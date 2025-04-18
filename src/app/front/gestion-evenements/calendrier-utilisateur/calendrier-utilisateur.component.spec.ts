import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendrierUtilisateurComponent } from './calendrier-utilisateur.component';

describe('CalendrierUtilisateurComponent', () => {
  let component: CalendrierUtilisateurComponent;
  let fixture: ComponentFixture<CalendrierUtilisateurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendrierUtilisateurComponent]
    });
    fixture = TestBed.createComponent(CalendrierUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
