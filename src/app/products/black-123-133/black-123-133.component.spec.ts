import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Black123133Component } from './black-123-133.component';

describe('Black123133Component', () => {
  let component: Black123133Component;
  let fixture: ComponentFixture<Black123133Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Black123133Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Black123133Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
