import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichageCategorieComponent } from './affichage-categorie.component';

describe('AffichageCategorieComponent', () => {
  let component: AffichageCategorieComponent;
  let fixture: ComponentFixture<AffichageCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichageCategorieComponent]
    });
    fixture = TestBed.createComponent(AffichageCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
