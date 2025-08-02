import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeBasedCatalogComponent } from './age-based-catalog.component';

describe('AgeBasedCatalogComponent', () => {
  let component: AgeBasedCatalogComponent;
  let fixture: ComponentFixture<AgeBasedCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgeBasedCatalogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeBasedCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
