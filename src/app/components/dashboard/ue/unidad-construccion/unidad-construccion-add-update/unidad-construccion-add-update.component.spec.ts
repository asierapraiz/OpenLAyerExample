import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadConstruccionAddUpdateComponent } from './unidad-construccion-add-update.component';

describe('UnidadConstruccionAddUpdateComponent', () => {
  let component: UnidadConstruccionAddUpdateComponent;
  let fixture: ComponentFixture<UnidadConstruccionAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadConstruccionAddUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadConstruccionAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
