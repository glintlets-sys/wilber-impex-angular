import { TestBed } from '@angular/core/testing';

import { ItemRecommendationService } from './item-recommendation.service';

describe('ItemRecommendationService', () => {
  let service: ItemRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
