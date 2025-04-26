import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementModifierComponent } from './evenement-modifier.component';

describe('EvenementModifierComponent', () => {
  let component: EvenementModifierComponent;
  let fixture: ComponentFixture<EvenementModifierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementModifierComponent]
    });
    fixture = TestBed.createComponent(EvenementModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
