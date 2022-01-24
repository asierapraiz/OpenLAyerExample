import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredioFilterComponent } from './predio-filter.component';

describe('PredioFilterComponent', () => {
  let component: PredioFilterComponent;
  let fixture: ComponentFixture<PredioFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredioFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredioFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
