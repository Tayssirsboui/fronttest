import { TestBed } from '@angular/core/testing';

import { ListeAttenteService } from './liste-attente.service.ts.service';

describe('ListeAttenteServiceTsService', () => {
  let service: ListeAttenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeAttenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
