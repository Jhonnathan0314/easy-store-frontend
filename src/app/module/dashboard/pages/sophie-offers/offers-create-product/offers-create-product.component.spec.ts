import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCreateProductComponent } from './offers-create-product.component';

describe('OffersCreateProductComponent', () => {
  let component: OffersCreateProductComponent;
  let fixture: ComponentFixture<OffersCreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersCreateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
