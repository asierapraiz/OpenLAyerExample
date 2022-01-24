import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaUnidadesAdministrativasComponent } from './carga-unidades-administrativas.component';

describe('CargaUnidadesAdministrativasComponent', () => {
  let component: CargaUnidadesAdministrativasComponent;
  let fixture: ComponentFixture<CargaUnidadesAdministrativasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargaUnidadesAdministrativasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaUnidadesAdministrativasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
