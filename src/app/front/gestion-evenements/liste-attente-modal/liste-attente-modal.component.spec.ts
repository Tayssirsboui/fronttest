import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeAttenteModalComponent } from './liste-attente-modal.component';

describe('ListeAttenteModalComponent', () => {
  let component: ListeAttenteModalComponent;
  let fixture: ComponentFixture<ListeAttenteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeAttenteModalComponent]
    });
    fixture = TestBed.createComponent(ListeAttenteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
