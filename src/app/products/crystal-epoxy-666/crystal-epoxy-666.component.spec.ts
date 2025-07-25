import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrystalEpoxy666Component } from './crystal-epoxy-666.component';

describe('CrystalEpoxy666Component', () => {
  let component: CrystalEpoxy666Component;
  let fixture: ComponentFixture<CrystalEpoxy666Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrystalEpoxy666Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrystalEpoxy666Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
