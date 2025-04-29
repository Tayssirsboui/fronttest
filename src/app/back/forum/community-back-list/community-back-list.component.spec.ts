import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityBackListComponent } from './community-back-list.component';

describe('CommunityBackListComponent', () => {
  let component: CommunityBackListComponent;
  let fixture: ComponentFixture<CommunityBackListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunityBackListComponent]
    });
    fixture = TestBed.createComponent(CommunityBackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
