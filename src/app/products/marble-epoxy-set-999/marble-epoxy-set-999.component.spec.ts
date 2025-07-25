import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleEpoxySet999Component } from './marble-epoxy-set-999.component';

describe('MarbleEpoxySet999Component', () => {
  let component: MarbleEpoxySet999Component;
  let fixture: ComponentFixture<MarbleEpoxySet999Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarbleEpoxySet999Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarbleEpoxySet999Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
