import { TestBed } from '@angular/core/testing';

import { ExtdireccionService } from './extdireccion.service';

describe('ExtdireccionService', () => {
  let service: ExtdireccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtdireccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
