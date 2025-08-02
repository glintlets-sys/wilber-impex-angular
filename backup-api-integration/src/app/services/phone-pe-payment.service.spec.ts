import { TestBed } from '@angular/core/testing';

import { PhonePePaymentService } from './phone-pe-payment.service';

describe('PhonePePaymentService', () => {
  let service: PhonePePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhonePePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
