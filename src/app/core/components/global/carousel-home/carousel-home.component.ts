import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { CarouselHomeObject, ResponsiveCarouselOptions } from '@models/utils/primeng-object.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { CarouselModule } from 'primeng/carousel';
import { Router, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonComponent } from "../../../../shared/inputs/button/button.component";
import { ErrorMessage } from '@models/data/general.model';
import { MessageModule } from 'primeng/message';
import { SessionService } from 'src/app/core/services/session/session.service';

@Component({
  selector: 'app-carousel-home',
  standalone: true,
  imports: [CarouselModule, SkeletonModule, MessageModule, RouterModule, ButtonComponent],
  templateUrl: './carousel-home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class CarouselHomeComponent implements OnInit {

  role: Signal<string> = computed(() => this.sessionService.role());

  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  categoriesError: Signal<ErrorMessage | null> = computed(() => this.categoryService.categoriesError())

  items: CarouselHomeObject[] = [];

  responsiveOptions: ResponsiveCarouselOptions[] = [];

  isLoading: boolean = true;
  hasUnexpectedError: boolean = false;

  constructor(
    private router: Router,
    private injector: Injector,
    private sessionService: SessionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.validateCategories();
    this.validateCategoriesError();
  }

  validateCategories() {
    effect(() => {
      if(this.categories().length == 0) return;
      this.items = this.categories().map(category => ({
        title: category.name,
        img: category.imageName != 'store.png' && category.image ? `data:${category.image?.extension};base64,${category.image?.content}` : '/assets/img/store.png',
        body: category.description,
        value: category.id,
        route: `store/products/${category.id}`,
        hidden: '',
        classes: ''
      }));
      this.defineResponsiveOptions();
      this.isLoading = false;
    }, {injector: this.injector})
  }

  validateCategoriesError() {
    effect(() => {
      if(this.categoriesError() == null) return;
      if(this.categoriesError()?.code !== 404) this.hasUnexpectedError = true;
      this.isLoading = false;
    }, {injector: this.injector})
  }

  defineResponsiveOptions() {
    this.responsiveOptions = [
      {
          breakpoint: '1400px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '1100px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '700px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  goCreateCategory() {
    this.router.navigateByUrl('/dashboard/category/form/0');
  }

}
