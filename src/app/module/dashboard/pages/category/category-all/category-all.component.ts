import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '@models/data/category.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { TableComponent } from "../../../../../shared/data/table/table.component";

@Component({
  selector: 'app-category-all',
  standalone: true,
  imports: [ TableComponent ],
  templateUrl: './category-all.component.html'
})
export class CategoryAllComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  mappedCategories: DataObject[] = [];

  categorySubscription: Subscription;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openSubscriptions() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.convertToDataObject();
      },
      error: (error) => {
        console.log('Ha ocurrido un error: ', {error});
      }
    })
  }

  closeSubscriptions() {
    this.categorySubscription.unsubscribe();
  }

  convertToDataObject() {
    this.mappedCategories = this.categories.map(cat => {
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description
      }
    })
  }

  deleteById(category: DataObject) {
    this.categoryService.deleteById(category.id);
  }

}
