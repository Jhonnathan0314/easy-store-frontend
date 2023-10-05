import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesUpdateProductComponent } from './shoes-update-product.component';

describe('ShoesUpdateProductComponent', () => {
  let component: ShoesUpdateProductComponent;
  let fixture: ComponentFixture<ShoesUpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoesUpdateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoesUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
