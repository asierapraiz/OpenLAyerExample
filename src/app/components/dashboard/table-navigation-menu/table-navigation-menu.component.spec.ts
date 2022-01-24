import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableNavigationMenuComponent } from './table-navigation-menu.component';

describe('TableNavigationMenuComponent', () => {
  let component: TableNavigationMenuComponent;
  let fixture: ComponentFixture<TableNavigationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableNavigationMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
