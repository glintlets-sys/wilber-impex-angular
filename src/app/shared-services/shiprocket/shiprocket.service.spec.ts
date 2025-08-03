import { TestBed } from '@angular/core/testing';

import { ShiprocketService } from './shiprocket.service';

describe('ShiprocketService', () => {
  let service: ShiprocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiprocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
