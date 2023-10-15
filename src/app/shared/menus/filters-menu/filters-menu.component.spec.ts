import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersMenuComponent } from './filters-menu.component';

describe('FiltersMenuComponent', () => {
  let component: FiltersMenuComponent;
  let fixture: ComponentFixture<FiltersMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltersMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
