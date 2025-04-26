import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeParticipationsComponent } from './liste-participations.component';

describe('ListeParticipationsComponent', () => {
  let component: ListeParticipationsComponent;
  let fixture: ComponentFixture<ListeParticipationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeParticipationsComponent]
    });
    fixture = TestBed.createComponent(ListeParticipationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
