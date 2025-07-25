import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StainProtector330NanoComponent } from './stain-protector-330-nano.component';

describe('StainProtector330NanoComponent', () => {
  let component: StainProtector330NanoComponent;
  let fixture: ComponentFixture<StainProtector330NanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StainProtector330NanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StainProtector330NanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
