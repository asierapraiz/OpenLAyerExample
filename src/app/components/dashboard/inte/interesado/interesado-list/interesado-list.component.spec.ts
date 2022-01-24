import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteresadoListComponent } from './interesado-list.component';

describe('InteresadoListComponent', () => {
  let component: InteresadoListComponent;
  let fixture: ComponentFixture<InteresadoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteresadoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteresadoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
