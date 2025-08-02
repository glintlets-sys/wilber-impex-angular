import { TestBed } from '@angular/core/testing';

import { AwsImageService } from './aws-image.service';

describe('AwsImageService', () => {
  let service: AwsImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AwsImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
