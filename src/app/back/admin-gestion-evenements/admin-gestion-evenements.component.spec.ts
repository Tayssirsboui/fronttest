import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGestionEvenementsComponent } from './admin-gestion-evenements.component';

describe('AdminGestionEvenementsComponent', () => {
  let component: AdminGestionEvenementsComponent;
  let fixture: ComponentFixture<AdminGestionEvenementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminGestionEvenementsComponent]
    });
    fixture = TestBed.createComponent(AdminGestionEvenementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
