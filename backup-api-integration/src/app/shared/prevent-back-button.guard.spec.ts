import { TestBed } from '@angular/core/testing';

import { PreventBackButtonGuard } from './prevent-back-button.guard';

describe('PreventBackButtonGuard', () => {
  let guard: PreventBackButtonGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventBackButtonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
