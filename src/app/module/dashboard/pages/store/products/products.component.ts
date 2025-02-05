import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputGroupTextComponent } from '@component/shared/inputs/input-group-text/input-group-text.component';
import { DataViewComponent } from '@component/shared/menus/data-view/data-view.component';
import { FiltersMenuComponent } from '@component/shared/menus/filters-menu/filters-menu.component';
import { Product } from '@models/data/product.model';
import { MessageService } from 'primeng/api';
import { Subscription, firstValueFrom } from 'rxjs';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, FiltersMenuComponent, InputGroupTextComponent, DataViewComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  providers: [ MessageService ],
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100%)',
        width: '0%'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0%)'
      })),
      transition('visible <=> hidden', [
        animate(300)
      ])
    ]),
    trigger('resize', [
      state('full', style({
        width: '100%'
      })),
      state('partial', style({
        width: '83.3333%'
      })),
      transition('full <=> partial', [
        animate(300)
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild("filtersRef") filtersContainer: ElementRef;
  @ViewChild("productsRef") productsContainer: ElementRef;
  
  products: Product[] = [];

  productsSubscription: Subscription;

  filtersState = 'hidden';
  productsState  = 'full';

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productsSubscribe();
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  productsSubscribe() {
    this.productsSubscription = this.productService.storedProducts$.subscribe({
      next: (value) => {
        this.products = value.filter(product => product.subcategory.categoryId == 1);
      }
    });
  }

  showHideFilters() {
    this.filtersState = this.filtersState === 'hidden' ? 'visible' : 'hidden';
    this.productsState = this.productsState === 'full' ? 'partial' : 'full';
  }

  async applyFilter(value: string) {
    this.products = await (firstValueFrom(this.productService.getByCategoryLikeName(1, value)));
  }

  async applyPriceFilter(value: number[]) {
    if(value[0] == 0) {
      this.products = await (firstValueFrom(this.productService.getByCategoryAndMaxPrice(1, value[1])));
    } else if (value[1] == 0){
      this.products = await (firstValueFrom(this.productService.getByCategoryAndMinPrice(1, value[0])));
    } else {
      this.products = await (firstValueFrom(this.productService.getByCategoryBetweenPrice(1, value[0], value[1])));
    }
  }

  async applySubcategoryFilter(value: string) {
    this.products = await (firstValueFrom(this.productService.getByCategoryAndSubcategory(1, value)));
  }

}
