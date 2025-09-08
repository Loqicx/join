import { TestBed } from '@angular/core/testing';

import { AppLoginServiceService } from './app-login-service.service';

describe('AppLoginServiceService', () => {
  let service: AppLoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppLoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
