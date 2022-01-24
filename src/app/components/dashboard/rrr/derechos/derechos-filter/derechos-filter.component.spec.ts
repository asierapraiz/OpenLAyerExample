import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerechosFilterComponent } from './derechos-filter.component';

describe('DerechosFilterComponent', () => {
  let component: DerechosFilterComponent;
  let fixture: ComponentFixture<DerechosFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerechosFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerechosFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
