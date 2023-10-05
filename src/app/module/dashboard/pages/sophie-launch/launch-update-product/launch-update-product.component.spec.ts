import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchUpdateProductComponent } from './launch-update-product.component';

describe('LaunchUpdateProductComponent', () => {
  let component: LaunchUpdateProductComponent;
  let fixture: ComponentFixture<LaunchUpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchUpdateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
