import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoesCartComponent } from './shoes-cart.component';

describe('ShoesCartComponent', () => {
  let component: ShoesCartComponent;
  let fixture: ComponentFixture<ShoesCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoesCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoesCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
