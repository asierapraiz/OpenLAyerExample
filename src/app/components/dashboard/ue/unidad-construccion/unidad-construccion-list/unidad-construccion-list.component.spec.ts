import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadConstruccionListComponent } from './unidad-construccion-list.component';

describe('UnidadConstruccionListComponent', () => {
  let component: UnidadConstruccionListComponent;
  let fixture: ComponentFixture<UnidadConstruccionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadConstruccionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadConstruccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
