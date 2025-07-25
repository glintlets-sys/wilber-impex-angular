import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyAdhesive152Component } from './epoxy-adhesive-152.component';

describe('EpoxyAdhesive152Component', () => {
  let component: EpoxyAdhesive152Component;
  let fixture: ComponentFixture<EpoxyAdhesive152Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyAdhesive152Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyAdhesive152Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
