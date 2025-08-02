import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedCategoriesComponent } from './promoted-categories.component';

describe('PromotedCategoriesComponent', () => {
  let component: PromotedCategoriesComponent;
  let fixture: ComponentFixture<PromotedCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotedCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotedCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
