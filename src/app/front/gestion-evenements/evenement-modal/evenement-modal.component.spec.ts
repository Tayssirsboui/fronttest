import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementModalComponent } from './evenement-modal.component';

describe('EvenementModalComponent', () => {
  let component: EvenementModalComponent;
  let fixture: ComponentFixture<EvenementModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementModalComponent]
    });
    fixture = TestBed.createComponent(EvenementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
