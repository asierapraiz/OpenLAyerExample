import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAgrupacionInteresadosComponent } from './filter-agrupacion-interesados.component';

describe('FilterAgrupacionInteresadosComponent', () => {
  let component: FilterAgrupacionInteresadosComponent;
  let fixture: ComponentFixture<FilterAgrupacionInteresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterAgrupacionInteresadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAgrupacionInteresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
