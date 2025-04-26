import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFrontComponent } from './login-front.component';

describe('LoginFrontComponent', () => {
  let component: LoginFrontComponent;
  let fixture: ComponentFixture<LoginFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginFrontComponent]
    });
    fixture = TestBed.createComponent(LoginFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
