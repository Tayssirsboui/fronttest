import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterProjetComponent } from './ajouter-projet.component';

describe('AjouterProjetComponent', () => {
  let component: AjouterProjetComponent;
  let fixture: ComponentFixture<AjouterProjetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterProjetComponent]
    });
    fixture = TestBed.createComponent(AjouterProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
