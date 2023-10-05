import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchProductsComponent } from './launch-products.component';

describe('LaunchProductsComponent', () => {
  let component: LaunchProductsComponent;
  let fixture: ComponentFixture<LaunchProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
