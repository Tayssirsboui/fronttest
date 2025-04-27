import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutRessourcesComponent } from './ajout-ressources.component';

describe('AjoutRessourcesComponent', () => {
  let component: AjoutRessourcesComponent;
  let fixture: ComponentFixture<AjoutRessourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutRessourcesComponent]
    });
    fixture = TestBed.createComponent(AjoutRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
