import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaintRemover250Component } from './paint-remover-250.component';

describe('PaintRemover250Component', () => {
  let component: PaintRemover250Component;
  let fixture: ComponentFixture<PaintRemover250Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaintRemover250Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaintRemover250Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
