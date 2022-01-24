import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerechosAddUpdateComponent } from './derechos-add-update.component';

describe('DerechosAddUpdateComponent', () => {
  let component: DerechosAddUpdateComponent;
  let fixture: ComponentFixture<DerechosAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerechosAddUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerechosAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
