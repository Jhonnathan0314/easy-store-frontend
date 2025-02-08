import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseAllComponent } from './purchase-all.component';

describe('PurchaseAllComponent', () => {
  let component: PurchaseAllComponent;
  let fixture: ComponentFixture<PurchaseAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
