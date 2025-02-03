import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAllComponent } from './category-all.component';

describe('CategoryAllComponent', () => {
  let component: CategoryAllComponent;
  let fixture: ComponentFixture<CategoryAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
