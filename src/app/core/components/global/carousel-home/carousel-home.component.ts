import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { CarouselHomeObject, ResponsiveCarouselOptions } from '@models/utils/primeng-object.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { CarouselModule } from 'primeng/carousel';
import { Router, RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ButtonComponent } from "../../../../shared/inputs/button/button.component";

@Component({
  selector: 'app-carousel-home',
  standalone: true,
  imports: [CarouselModule, SkeletonModule, RouterModule, ButtonComponent],
  templateUrl: './carousel-home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class CarouselHomeComponent implements OnInit, OnDestroy {

  categories: Category[] = [];
  items: CarouselHomeObject[] = [];

  responsiveOptions: ResponsiveCarouselOptions[] = [];

  isLoading = true;

  categoriesSuscription: Subscription;

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoriesSubscribe();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  closeSubscriptions() {
    if(this.categoriesSuscription)
      this.categoriesSuscription.unsubscribe();
  }

  categoriesSubscribe() {
    this.categoriesSuscription = this.categoryService.storedCategories$.subscribe({
      next: (value) => {
        if(value.length == 0) return;
        this.categories = value;
        this.defineItems();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) this.categories = [];
        this.isLoading = false;
      }
    });
  }

  defineItems() {
    this.categories.forEach(category => {
      this.items.push({
        title: category.name,
        img: category.imageName != 'store.png' && category.image ? `data:${category.image?.extension};base64,${category.image?.content}` : '/assets/img/store.png',
        body: category.description,
        value: category.id,
        route: `store/products/${category.id}`,
        hidden: '',
        classes: ''
      });
    });
    this.defineResponsiveOptions();
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
