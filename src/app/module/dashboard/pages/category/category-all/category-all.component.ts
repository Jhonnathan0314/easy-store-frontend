import { Component, computed, Signal } from '@angular/core';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router, RouterModule } from '@angular/router';
import { LoadingTableComponent } from "../../../../../shared/skeleton/loading-table/loading-table.component";

@Component({
  selector: 'app-category-all',
  standalone: true,
  imports: [RouterModule, TableComponent, ButtonComponent, LoadingTableComponent],
  templateUrl: './category-all.component.html'
})
export class CategoryAllComponent {

  isLoading: Signal<boolean> = computed(() => this.categoryService.categories().length === 0);

  mappedCategories: Signal<DataObject[]> = computed<DataObject[]>(() => 
    this.categoryService.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageName: cat.imageName,
      imageObj: cat.image ?? undefined
    }))
  );
  
  categorySubscription: Subscription;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) { }

  deleteById(category: DataObject) {
    this.categoryService.deleteById(category?.id ?? 0);
  }

  goCreate() {
    this.router.navigateByUrl('/dashboard/category/form/0');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
