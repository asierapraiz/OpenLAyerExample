import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DerechosListComponent } from './derechos-list.component';

describe('DerechosListComponent', () => {
  let component: DerechosListComponent;
  let fixture: ComponentFixture<DerechosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DerechosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerechosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
