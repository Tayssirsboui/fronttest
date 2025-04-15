import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLayoutComponent } from './back-layout.component';

describe('BackLayoutComponent', () => {
  let component: BackLayoutComponent;
  let fixture: ComponentFixture<BackLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BackLayoutComponent]
    });
    fixture = TestBed.createComponent(BackLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
