import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstruccionFilterComponent } from './construccion-filter.component';

describe('ConstruccionFilterComponent', () => {
  let component: ConstruccionFilterComponent;
  let fixture: ComponentFixture<ConstruccionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstruccionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstruccionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
