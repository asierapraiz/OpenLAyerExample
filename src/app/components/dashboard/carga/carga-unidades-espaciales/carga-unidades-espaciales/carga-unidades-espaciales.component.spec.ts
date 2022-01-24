import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaUnidadesEspacialesComponent } from './carga-unidades-espaciales.component';

describe('CargaTerrenoComponent', () => {
  let component: CargaUnidadesEspacialesComponent;
  let fixture: ComponentFixture<CargaUnidadesEspacialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaUnidadesEspacialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaUnidadesEspacialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
