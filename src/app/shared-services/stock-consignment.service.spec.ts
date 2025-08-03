import { TestBed } from '@angular/core/testing';

import { StockConsignmentService } from './stock-consignment.service';

describe('StockConsignmentService', () => {
  let service: StockConsignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockConsignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
