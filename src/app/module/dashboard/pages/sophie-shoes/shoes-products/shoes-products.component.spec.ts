import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesProductsComponent } from './shoes-products.component';

describe('ShoesProductsComponent', () => {
  let component: ShoesProductsComponent;
  let fixture: ComponentFixture<ShoesProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoesProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
