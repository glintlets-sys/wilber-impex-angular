import { TestBed } from '@angular/core/testing';

import { RecommendationsTsService } from './recommendations.ts.service';

describe('RecommendationsTsService', () => {
  let service: RecommendationsTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecommendationsTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
