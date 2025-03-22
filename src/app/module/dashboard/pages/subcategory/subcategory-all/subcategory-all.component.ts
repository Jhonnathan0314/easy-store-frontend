import { Component, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subcategory } from '@models/data/subcategory.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { Category } from '@models/data/category.model';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';

@Component({
  selector: 'app-subcategory-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './subcategory-all.component.html'
})
export class SubcategoryAllComponent {

  subcategories: Signal<Subcategory[]> = computed<Subcategory[]>(() => this.subcategoryService.subcategories());
  mappedSubcategories: Signal<DataObject[]> = computed<DataObject[]>(() => this.subcategoryService.subcategories().map(sub => {
    const category = this.categories().find(cat => cat.id == sub.categoryId) ?? new Category();
    return{
      id: sub.id,
      name: sub.name,
      categoryId: sub.categoryId,
      categoryName: category.name
    }
  }));
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());

  isLoading = true;

  constructor(
    private router: Router,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  deleteById(subcategory: DataObject) {
    this.subcategoryService.deleteById(subcategory?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/subcategory/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
