import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleRustRemover240Component } from './marble-rust-remover-240.component';

describe('MarbleRustRemover240Component', () => {
  let component: MarbleRustRemover240Component;
  let fixture: ComponentFixture<MarbleRustRemover240Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleRustRemover240Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleRustRemover240Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
