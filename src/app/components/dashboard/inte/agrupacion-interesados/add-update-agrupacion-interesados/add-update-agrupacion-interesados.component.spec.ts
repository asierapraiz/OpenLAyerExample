import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateAgrupacionInteresadosComponent } from './add-update-agrupacion-interesados.component';

describe('AddUpdateAgrupacionInteresadosComponent', () => {
  let component: AddUpdateAgrupacionInteresadosComponent;
  let fixture: ComponentFixture<AddUpdateAgrupacionInteresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAgrupacionInteresadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateAgrupacionInteresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
