import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetDetailsComponent } from './projet-details.component';

describe('ProjetDetailsComponent', () => {
  let component: ProjetDetailsComponent;
  let fixture: ComponentFixture<ProjetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjetDetailsComponent]
    });
    fixture = TestBed.createComponent(ProjetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
