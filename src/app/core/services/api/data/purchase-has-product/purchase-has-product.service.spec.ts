import { TestBed } from '@angular/core/testing';

import { PurchaseHasProductService } from './purchase-has-product.service';

describe('PurchaseHasProductService', () => {
  let service: PurchaseHasProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseHasProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
