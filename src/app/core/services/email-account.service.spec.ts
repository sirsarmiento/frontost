import { TestBed } from '@angular/core/testing';

import { EmailAccountService } from './email-account.service';

describe('EmailAccountService', () => {
  let service: EmailAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
