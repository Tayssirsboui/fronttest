import { TestBed } from '@angular/core/testing';

import { CustomUserServiceService } from './custom-user-service.service';

describe('CustomUserServiceService', () => {
  let service: CustomUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
