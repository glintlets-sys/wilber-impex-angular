import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeutralCleaner230Component } from './neutral-cleaner-230.component';

describe('NeutralCleaner230Component', () => {
  let component: NeutralCleaner230Component;
  let fixture: ComponentFixture<NeutralCleaner230Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeutralCleaner230Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeutralCleaner230Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
