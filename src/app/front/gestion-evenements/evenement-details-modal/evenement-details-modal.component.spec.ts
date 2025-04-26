import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementDetailsModalComponent } from './evenement-details-modal.component';

describe('EvenementDetailsModalComponent', () => {
  let component: EvenementDetailsModalComponent;
  let fixture: ComponentFixture<EvenementDetailsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementDetailsModalComponent]
    });
    fixture = TestBed.createComponent(EvenementDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
