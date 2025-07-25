import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraniteTilesCleaner201Component } from './granite-tiles-cleaner-201.component';

describe('GraniteTilesCleaner201Component', () => {
  let component: GraniteTilesCleaner201Component;
  let fixture: ComponentFixture<GraniteTilesCleaner201Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraniteTilesCleaner201Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraniteTilesCleaner201Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
