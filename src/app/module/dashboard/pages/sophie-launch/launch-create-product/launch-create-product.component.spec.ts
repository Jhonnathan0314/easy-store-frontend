import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchCreateProductComponent } from './launch-create-product.component';

describe('LaunchCreateProductComponent', () => {
  let component: LaunchCreateProductComponent;
  let fixture: ComponentFixture<LaunchCreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchCreateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
