import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityDetailComponent } from './community-detail.component';

describe('CommunityDetailComponent', () => {
  let component: CommunityDetailComponent;
  let fixture: ComponentFixture<CommunityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityDetailComponent]
    });
    fixture = TestBed.createComponent(CommunityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
