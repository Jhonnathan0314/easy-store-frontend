import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersCartComponent } from './offers-cart.component';

describe('OffersCartComponent', () => {
  let component: OffersCartComponent;
  let fixture: ComponentFixture<OffersCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffersCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
