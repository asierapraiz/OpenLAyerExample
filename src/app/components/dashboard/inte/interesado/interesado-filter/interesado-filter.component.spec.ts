import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresadoFilterComponent } from './interesado-filter.component';

describe('InteresadoFilterComponent', () => {
  let component: InteresadoFilterComponent;
  let fixture: ComponentFixture<InteresadoFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteresadoFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteresadoFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
