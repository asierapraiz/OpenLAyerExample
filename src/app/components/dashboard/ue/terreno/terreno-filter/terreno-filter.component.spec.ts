import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerrenoFilterComponent } from './terreno-filter.component';

describe('TerrenoFilterComponent', () => {
  let component: TerrenoFilterComponent;
  let fixture: ComponentFixture<TerrenoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerrenoFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerrenoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
