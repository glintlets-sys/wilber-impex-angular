import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeraPolish450Component } from './cera-polish-450.component';

describe('CeraPolish450Component', () => {
  let component: CeraPolish450Component;
  let fixture: ComponentFixture<CeraPolish450Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CeraPolish450Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CeraPolish450Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
