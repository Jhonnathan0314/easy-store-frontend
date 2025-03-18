import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingDataViewComponent } from './loading-data-view.component';

describe('LoadingDataViewComponent', () => {
  let component: LoadingDataViewComponent;
  let fixture: ComponentFixture<LoadingDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingDataViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
