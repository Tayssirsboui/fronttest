import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapModalComponent } from './roadmap-modal.component';

describe('RoadmapModalComponent', () => {
  let component: RoadmapModalComponent;
  let fixture: ComponentFixture<RoadmapModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoadmapModalComponent]
    });
    fixture = TestBed.createComponent(RoadmapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
