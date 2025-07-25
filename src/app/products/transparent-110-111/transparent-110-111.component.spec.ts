import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transparent110111Component } from './transparent-110-111.component';

describe('Transparent110111Component', () => {
  let component: Transparent110111Component;
  let fixture: ComponentFixture<Transparent110111Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transparent110111Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transparent110111Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
