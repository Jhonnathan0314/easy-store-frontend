import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory } from '@models/data/subcategory.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { SubcategoryService } from 'src/app/core/services/api/data/subcategory/subcategory.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { Category } from '@models/data/category.model';
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { SubcategoryTableComponent } from "../subcategory-table/subcategory-table.component";
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subcategory-all',
  standalone: true,
  imports: [MessageModule, ToastModule, ButtonComponent, LoadingTableComponent, SubcategoryTableComponent],
  templateUrl: './subcategory-all.component.html',
  providers: [MessageService]
})
export class SubcategoryAllComponent implements OnInit {

  subcategories: Signal<Subcategory[]> = computed<Subcategory[]>(() => this.subcategoryService.subcategories());
  subcategoriesError: Signal<ErrorMessage | null> = computed(() => this.subcategoryService.subcategoriesError());
  mappedSubcategories: Subcategory[] = [];
  
  categories: Signal<Category[]> = computed<Category[]>(() => this.categoryService.categories());

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private subcategoryService: SubcategoryService,
    private categoryService: CategoryService,
    private messageService: MessageService
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
    }, {injector: this.injector})
  }

  validateSubcategoriesError() {
    effect(() => {
      if(this.subcategoriesError() == null) return;
      if(this.subcategoriesError()?.code != 404) this.hasUnexpectedError = true;
    }, {injector: this.injector})
  }

  deleteById(subcategory: DataObject) {
    this.subcategoryService.deleteById(subcategory?.id ?? 0).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error) {
          if(error.error.code == 401) {
            this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'No se puede eliminar debido a que se encuentra asociada a otros datos.'});
           return; 
          }
        }
        this.messageService.add({severity: 'error', summary: 'Error desconocido', detail: 'Por favor, intentelo de nuevo más tarde.'});
      }
    });
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
