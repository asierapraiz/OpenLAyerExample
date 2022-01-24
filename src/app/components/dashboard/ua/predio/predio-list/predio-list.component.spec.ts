import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredioListComponent } from './predio-list.component';

describe('PredioListComponent', () => {
  let component: PredioListComponent;
  let fixture: ComponentFixture<PredioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredioListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
