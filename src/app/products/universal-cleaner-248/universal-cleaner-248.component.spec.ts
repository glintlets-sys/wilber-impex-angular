import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalCleaner248Component } from './universal-cleaner-248.component';

describe('UniversalCleaner248Component', () => {
  let component: UniversalCleaner248Component;
  let fixture: ComponentFixture<UniversalCleaner248Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversalCleaner248Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversalCleaner248Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
