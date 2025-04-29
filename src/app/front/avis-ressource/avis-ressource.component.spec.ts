import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisRessourceComponent } from './avis-ressource.component';

describe('AvisRessourceComponent', () => {
  let component: AvisRessourceComponent;
  let fixture: ComponentFixture<AvisRessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisRessourceComponent]
    });
    fixture = TestBed.createComponent(AvisRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
