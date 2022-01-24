import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomConfirmDialogComponent } from './custom-confirm-dialog.component';

describe('CustomConfirmDialogComponent', () => {
  let component: CustomConfirmDialogComponent;
  let fixture: ComponentFixture<CustomConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
