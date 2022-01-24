import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadConstruccionFilterComponent } from './unidad-construccion-filter.component';

describe('UnidadConstruccionFilterComponent', () => {
  let component: UnidadConstruccionFilterComponent;
  let fixture: ComponentFixture<UnidadConstruccionFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadConstruccionFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadConstruccionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
