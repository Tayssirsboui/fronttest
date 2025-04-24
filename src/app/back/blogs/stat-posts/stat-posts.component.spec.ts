import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatPostsComponent } from './stat-posts.component';

describe('StatPostsComponent', () => {
  let component: StatPostsComponent;
  let fixture: ComponentFixture<StatPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatPostsComponent]
    });
    fixture = TestBed.createComponent(StatPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
