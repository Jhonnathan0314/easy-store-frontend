import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { ResponsiveOverlayOptions } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { CarouselHomeObject, ResponsiveCarouselOptions } from 'src/app/core/models/data-types/primeng-object.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css'],
})
export class CarouselHomeComponent implements OnInit, OnDestroy {

  @ViewChildren('section') container: ElementRef;

  categories: Category[] = [];
  items: CarouselHomeObject[] = [];

  responsiveOptions: ResponsiveCarouselOptions[] = [];

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
        this.categories = value;
        this.defineItems();
        this.defineResponsiveOptions();
      }
    });
  }

  defineItems() {
    this.categories.forEach(category => {
      this.items.push({
        title: category.name,
        img: `../../../../../assets/img/${category.imageName}`,
        body: category.description,
        value: category.id,
        // route: category.imageName.split('.')[0],
        route: 'store',
        hidden: '',
        classes: ''
      });
    });
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
