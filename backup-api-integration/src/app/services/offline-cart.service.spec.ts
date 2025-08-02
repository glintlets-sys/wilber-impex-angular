import { TestBed } from '@angular/core/testing';

import { OfflineCartService } from './offline-cart.service';

describe('OfflineCartService', () => {
  let service: OfflineCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
