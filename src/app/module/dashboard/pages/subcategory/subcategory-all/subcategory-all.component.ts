import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subcategory } from '@models/data/subcategory.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { Subscription } from 'rxjs';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { Category } from '@models/data/category.model';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-subcategory-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent, LoadingTableComponent],
  templateUrl: './subcategory-all.component.html'
})
export class SubcategoryAllComponent {

  subcategories: Subcategory[] = [];
  mappedSubcategories: DataObject[] = [];
  
  categories: Category[] = [];

  isLoading = true;

  subcategorySubscription: Subscription;
  categorySubscription: Subscription;

  constructor(
    private router: Router,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openSubscriptions() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        if(categories.length == 0) return;
        this.categories = categories;
        this.openSubcategorySubscription();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.categories = [];
          this.subcategories = [];
        }
        this.isLoading = false;
      }
    })
  }

  openSubcategorySubscription() {
    if(this.categories.length == 0) return;
    this.subcategorySubscription = this.subcategoryService.storedSubcategories$.subscribe({
      next: (subcategories) => {
        if(subcategories.length == 0) return;
        this.subcategories = subcategories;
        this.convertToDataObject();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.subcategories = [];
        }
        this.isLoading = false;
      }
    })
  }

  closeSubscriptions() {
    if(this.categorySubscription) 
      this.categorySubscription.unsubscribe();
    if(this.subcategorySubscription) 
      this.subcategorySubscription.unsubscribe();
  }

  convertToDataObject() {
    let category = new Category();
    this.mappedSubcategories = this.subcategories.map(sub => {
      category = this.categories.find(cat => cat.id == sub.categoryId) ?? new Category();
      return {
        id: sub.id,
        name: sub.name,
        categoryId: sub.categoryId,
        categoryName: category.name
      }
    })
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
