import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProjetsComponent } from './list-projets.component';

describe('ListProjetsComponent', () => {
  let component: ListProjetsComponent;
  let fixture: ComponentFixture<ListProjetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProjetsComponent]
    });
    fixture = TestBed.createComponent(ListProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
