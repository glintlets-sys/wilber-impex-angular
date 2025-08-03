import { TestBed } from '@angular/core/testing';

import { BoughtTogetherService } from './bought-together.service';

describe('BoughtTogetherService', () => {
  let service: BoughtTogetherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoughtTogetherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
