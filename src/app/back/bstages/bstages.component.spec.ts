import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BstagesComponent } from './bstages.component';

describe('BstagesComponent', () => {
  let component: BstagesComponent;
  let fixture: ComponentFixture<BstagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BstagesComponent]
    });
    fixture = TestBed.createComponent(BstagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
