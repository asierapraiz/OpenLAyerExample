import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInteresadoComponent } from './add-update-interesado.component';

describe('AddUpdatePredioComponent', () => {
  let component: AddUpdateInteresadoComponent;
  let fixture: ComponentFixture<AddUpdateInteresadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateInteresadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInteresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
