import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKanbanComponent } from './dashboard-kanban.component';

describe('DashboardKanbanComponent', () => {
  let component: DashboardKanbanComponent;
  let fixture: ComponentFixture<DashboardKanbanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardKanbanComponent]
    });
    fixture = TestBed.createComponent(DashboardKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
