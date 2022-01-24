import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemoveMiembrosComponent } from './add-remove-miembros.component';

describe('AddRemoveMiembrosComponent', () => {
  let component: AddRemoveMiembrosComponent;
  let fixture: ComponentFixture<AddRemoveMiembrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemoveMiembrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemoveMiembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
