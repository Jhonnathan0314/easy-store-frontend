import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { CarouselHomeObject, ResponsiveCarouselOptions } from '@models/utils/primeng-object.model';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { CarouselModule } from 'primeng/carousel';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carousel-home',
  standalone: true,
  imports: [CarouselModule, RouterModule],
  templateUrl: './carousel-home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class CarouselHomeComponent implements OnInit, OnDestroy {

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
        img: `/assets/img/${category.imageName}`,
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
