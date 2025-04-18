import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipationModalComponent } from './participation-modal.component';

describe('ParticipationModalComponent', () => {
  let component: ParticipationModalComponent;
  let fixture: ComponentFixture<ParticipationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipationModalComponent]
    });
    fixture = TestBed.createComponent(ParticipationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
