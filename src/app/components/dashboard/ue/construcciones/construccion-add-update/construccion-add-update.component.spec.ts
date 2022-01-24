import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstruccionAddUpdateComponent } from './construccion-add-update.component';

describe('ConstruccionAddUpdateComponent', () => {
  let component: ConstruccionAddUpdateComponent;
  let fixture: ComponentFixture<ConstruccionAddUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstruccionAddUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstruccionAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
