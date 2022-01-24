import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstruccionListComponent } from './construccion-list.component';

describe('ConstruccionListComponent', () => {
  let component: ConstruccionListComponent;
  let fixture: ComponentFixture<ConstruccionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstruccionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstruccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
