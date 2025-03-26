import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subcategory } from '@models/data/subcategory.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { Category } from '@models/data/category.model';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-subcategory-all',
  standalone: true,
  imports: [MessageModule, ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './subcategory-all.component.html'
})
export class SubcategoryAllComponent implements OnInit {

  subcategories: Signal<Subcategory[]> = computed<Subcategory[]>(() => this.subcategoryService.subcategories());
  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  mappedSubcategories: DataObject[] = [];
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());

  isLoading: boolean = true;
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private injector: Injector,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.extractMappedSubcategories();
    this.validateSubcategoriesError();
  }

  extractMappedSubcategories() {
    effect(() => {
      this.mappedSubcategories = this.subcategoryService.subcategories().map(sub => {
        const category = this.categories().find(cat => cat.id == sub.categoryId) ?? new Category();
        return {
          id: sub.id,
          name: sub.name,
          categoryId: sub.categoryId,
          categoryName: category.name
        }
      })
      this.isLoading = false;
    }, {injector: this.injector})
  }

  validateSubcategoriesError() {
    effect(() => {
      if(this.subcategoriesError() == null) return;
      if(this.subcategoriesError()?.code != 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

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
