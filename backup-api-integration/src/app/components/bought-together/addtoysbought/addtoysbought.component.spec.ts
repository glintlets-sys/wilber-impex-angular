import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtoysboughtComponent } from './addtoysbought.component';

describe('AddtoysboughtComponent', () => {
  let component: AddtoysboughtComponent;
  let fixture: ComponentFixture<AddtoysboughtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtoysboughtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtoysboughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
