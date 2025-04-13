import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingTableComponent } from "../../../../../shared/skeleton/loading-table/loading-table.component";
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { Category } from '@models/data/category.model';
import { CategoryTableComponent } from "../category-table/category-table.component";
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';

@Component({
  selector: 'app-category-all',
  standalone: true,
  imports: [RouterModule, MessageModule, ButtonComponent, LoadingTableComponent, CategoryTableComponent],
  templateUrl: './category-all.component.html'
})
export class CategoryAllComponent implements OnInit {

  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  
  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.validateCategoriesError();
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code != 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  deleteById(category: Category) {
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
