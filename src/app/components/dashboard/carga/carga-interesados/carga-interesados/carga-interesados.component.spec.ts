import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInteresadosComponent } from './carga-interesados.component';

describe('CargaInteresadosComponent', () => {
  let component: CargaInteresadosComponent;
  let fixture: ComponentFixture<CargaInteresadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaInteresadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaInteresadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
