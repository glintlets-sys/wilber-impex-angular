import { TestBed } from '@angular/core/testing';

import { NotifyMeService } from './notify-me.service';

describe('NotifyMeService', () => {
  let service: NotifyMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotifyMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
