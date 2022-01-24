import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePredioComponent } from './add-update-predio.component';

describe('AddUpdatePredioComponent', () => {
  let component: AddUpdatePredioComponent;
  let fixture: ComponentFixture<AddUpdatePredioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdatePredioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePredioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
