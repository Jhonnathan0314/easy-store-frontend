import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersProductsComponent } from './offers-products.component';

describe('OffersProductsComponent', () => {
  let component: OffersProductsComponent;
  let fixture: ComponentFixture<OffersProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
