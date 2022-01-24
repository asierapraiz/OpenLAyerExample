import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionDialogComponent } from './navegacion-dialog.component';

describe('NavegacionDialogComponent', () => {
  let component: NavegacionDialogComponent;
  let fixture: ComponentFixture<NavegacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
