import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateTerrenoComponent } from './add-update-terreno.component';

describe('AddUpdateTerrenoComponent', () => {
  let component: AddUpdateTerrenoComponent;
  let fixture: ComponentFixture<AddUpdateTerrenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateTerrenoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateTerrenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
