import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgrupacionInteresadosListComponent } from './agrupacion-interesados-list.component';

describe('AgrupacionInteresadosListComponent', () => {
  let component: AgrupacionInteresadosListComponent;
  let fixture: ComponentFixture<AgrupacionInteresadosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgrupacionInteresadosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrupacionInteresadosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
