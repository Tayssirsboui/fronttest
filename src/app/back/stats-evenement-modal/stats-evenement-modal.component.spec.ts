import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsEvenementModalComponent } from './stats-evenement-modal.component';

describe('StatsEvenementModalComponent', () => {
  let component: StatsEvenementModalComponent;
  let fixture: ComponentFixture<StatsEvenementModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsEvenementModalComponent]
    });
    fixture = TestBed.createComponent(StatsEvenementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
