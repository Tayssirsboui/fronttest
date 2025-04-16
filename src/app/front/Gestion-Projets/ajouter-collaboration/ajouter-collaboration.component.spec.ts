import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterCollaborationComponent } from './ajouter-collaboration.component';

describe('AjouterCollaborationComponent', () => {
  let component: AjouterCollaborationComponent;
  let fixture: ComponentFixture<AjouterCollaborationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterCollaborationComponent]
    });
    fixture = TestBed.createComponent(AjouterCollaborationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
