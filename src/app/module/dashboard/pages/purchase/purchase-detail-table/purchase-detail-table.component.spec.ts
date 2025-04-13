import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseDetailTableComponent } from './purchase-detail-table.component';

describe('PurchaseDetailTableComponent', () => {
  let component: PurchaseDetailTableComponent;
  let fixture: ComponentFixture<PurchaseDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseDetailTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
