import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesCreateProductComponent } from './shoes-create-product.component';

describe('ShoesCreateProductComponent', () => {
  let component: ShoesCreateProductComponent;
  let fixture: ComponentFixture<ShoesCreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoesCreateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoesCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
