import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory } from '@models/data/subcategory.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { Category } from '@models/data/category.model';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { SubcategoryTableComponent } from "../subcategory-table/subcategory-table.component";

@Component({
  selector: 'app-subcategory-all',
  standalone: true,
  imports: [MessageModule, ButtonComponent, LoadingTableComponent, SubcategoryTableComponent],
  templateUrl: './subcategory-all.component.html'
})
export class SubcategoryAllComponent implements OnInit {

  subcategories: Signal<Subcategory[]> = computed<Subcategory[]>(() => this.subcategoryService.subcategories());
  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  mappedSubcategories: Subcategory[] = [];
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());

  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      this.mappedSubcategories = this.subcategories().map(sub => {
        const category = this.categories().find(cat => cat.id == sub.categoryId) ?? new Category();
        return {
          id: sub.id,
          name: sub.name,
          categoryId: sub.categoryId,
          category: category
        }
      })
      this.isLoading = false;
      if(this.isWorking) this.isWorking = false;
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
    this.isWorking = true;
    this.subcategoryService.deleteById(subcategory?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/subcategory/form/0');
  }

  goUpdate(subcategory: Subcategory) {
    this.router.navigateByUrl(`/dashboard/subcategory/form/${subcategory.id}`);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
