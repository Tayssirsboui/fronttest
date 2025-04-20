import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateAcountComponent } from './activate-acount.component';

describe('ActivateAcountComponent', () => {
  let component: ActivateAcountComponent;
  let fixture: ComponentFixture<ActivateAcountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivateAcountComponent]
    });
    fixture = TestBed.createComponent(ActivateAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
