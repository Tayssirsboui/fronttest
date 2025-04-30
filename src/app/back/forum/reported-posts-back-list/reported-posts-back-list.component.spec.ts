import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedPostsBackListComponent } from './reported-posts-back-list.component';

describe('ReportedPostsBackListComponent', () => {
  let component: ReportedPostsBackListComponent;
  let fixture: ComponentFixture<ReportedPostsBackListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportedPostsBackListComponent]
    });
    fixture = TestBed.createComponent(ReportedPostsBackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
