import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraniteRustRemover253Component } from './granite-rust-remover-253.component';

describe('GraniteRustRemover253Component', () => {
  let component: GraniteRustRemover253Component;
  let fixture: ComponentFixture<GraniteRustRemover253Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraniteRustRemover253Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraniteRustRemover253Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
