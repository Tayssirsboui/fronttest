import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRessourceComponent } from './stat-ressource.component';

describe('StatRessourceComponent', () => {
  let component: StatRessourceComponent;
  let fixture: ComponentFixture<StatRessourceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatRessourceComponent]
    });
    fixture = TestBed.createComponent(StatRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
