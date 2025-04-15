import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePageComponent } from './sample-page.component';

describe('SamplePageComponent', () => {
  let component: SamplePageComponent;
  let fixture: ComponentFixture<SamplePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SamplePageComponent]
    });
    fixture = TestBed.createComponent(SamplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
