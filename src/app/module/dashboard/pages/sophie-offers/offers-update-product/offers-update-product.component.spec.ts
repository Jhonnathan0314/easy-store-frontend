import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersUpdateProductComponent } from './offers-update-product.component';

describe('OffersUpdateProductComponent', () => {
  let component: OffersUpdateProductComponent;
  let fixture: ComponentFixture<OffersUpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersUpdateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
