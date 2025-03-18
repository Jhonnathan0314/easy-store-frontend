import { TestBed } from '@angular/core/testing';

import { FileProductService } from './file-product.service';

describe('FileProductService', () => {
  let service: FileProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
