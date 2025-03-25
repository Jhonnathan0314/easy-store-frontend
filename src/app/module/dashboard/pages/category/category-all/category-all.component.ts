import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router, RouterModule } from '@angular/router';
import { LoadingTableComponent } from "../../../../../shared/skeleton/loading-table/loading-table.component";
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-category-all',
  standalone: true,
  imports: [RouterModule, TableComponent, MessageModule, ButtonComponent, LoadingTableComponent],
  templateUrl: './category-all.component.html'
})
export class CategoryAllComponent implements OnInit {

  mappedCategories: Signal<DataObject[]> = computed<DataObject[]>(() => 
    this.categoryService.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageName: cat.imageName,
      imageObj: cat.image ?? undefined
    }))
  );
  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError());
  
  isLoading: boolean = true;
  hasUnexpectedError: boolean = false;
  
  categorySubscription: Subscription;

  constructor(
    private router: Router,
    private injector: Injector,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.validateCategoriesError();
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code != 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  deleteById(category: DataObject) {
    this.categoryService.deleteById(category.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/category/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
