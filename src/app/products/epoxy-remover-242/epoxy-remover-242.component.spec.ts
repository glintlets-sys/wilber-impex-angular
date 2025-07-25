import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpoxyRemover242Component } from './epoxy-remover-242.component';

describe('EpoxyRemover242Component', () => {
  let component: EpoxyRemover242Component;
  let fixture: ComponentFixture<EpoxyRemover242Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpoxyRemover242Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpoxyRemover242Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
