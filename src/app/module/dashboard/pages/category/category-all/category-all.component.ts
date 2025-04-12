import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingTableComponent } from "../../../../../shared/skeleton/loading-table/loading-table.component";
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { Category } from '@models/data/category.model';
import { CategoryTableComponent } from "../category-table/category-table.component";

@Component({
  selector: 'app-category-all',
  standalone: true,
  imports: [RouterModule, MessageModule, ButtonComponent, LoadingTableComponent, CategoryTableComponent],
  templateUrl: './category-all.component.html'
})
export class CategoryAllComponent implements OnInit {

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  
  isLoading: boolean = true;
  isWorking: boolean = false;
  hasUnexpectedError: boolean = false;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.validateCategoriesError();
    this.extractMappedCategories();
  }

  extractMappedCategories() {
    effect(() => {
      this.isLoading = false;
      if(this.isWorking) this.isWorking = false;
    }, {injector: this.injector})
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code != 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  deleteById(category: Category) {
    this.isWorking = true;
    this.categoryService.deleteById(category.id);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/category/form/0');
  }

  goUpdate(category: Category) {
    this.router.navigateByUrl(`/dashboard/category/form/${category.id}`);
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

}
