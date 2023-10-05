import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchCartComponent } from './launch-cart.component';

describe('LaunchCartComponent', () => {
  let component: LaunchCartComponent;
  let fixture: ComponentFixture<LaunchCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
