import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { CarouselHomeObject, ResponsiveCarouselOptions } from '@models/utils/primeng-object.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-carousel-home',
  standalone: true,
  imports: [CarouselModule, SkeletonModule, RouterModule],
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
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoriesSubscribe();
  }

  ngOnDestroy(): void {
    this.categoriesSuscription.unsubscribe();
  }

  categoriesSubscribe() {
    this.categoriesSuscription = this.categoryService.storedCategories$.subscribe({
      next: (value) => {
        if(value.length == 0) return;
        this.categories = value;
        this.defineItems();
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

}
