import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryAllComponent } from './subcategory-all.component';

describe('SubcategoryAllComponent', () => {
  let component: SubcategoryAllComponent;
  let fixture: ComponentFixture<SubcategoryAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoryAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
