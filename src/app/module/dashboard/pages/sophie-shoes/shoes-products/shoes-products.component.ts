import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Product } from '@models/data/product.model';
import { MessageService } from 'primeng/api';
import { Subscription, firstValueFrom } from 'rxjs';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';

@Component({
  selector: 'app-shoes-products',
  templateUrl: './shoes-products.component.html',
  styleUrls: ['./shoes-products.component.css'],
  providers: [ MessageService ]
})
export class ShoesProductsComponent implements OnInit, OnDestroy {

  @ViewChild("filtersRef") filtersContainer: ElementRef;
  @ViewChild("productsRef") productsContainer: ElementRef;
  
  products: Product[] = [];

  productsSubscription: Subscription;

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
        this.products = value;
      }
    });
  }

  showHideFilters() {
    const isFilterVisible = this.filtersContainer.nativeElement.classList.contains("col-2");
    const isMobile = window.innerWidth <= 1150;
    if(isMobile){
      if(isFilterVisible) {
        this.filtersContainer.nativeElement.classList.remove("col-12");
        this.filtersContainer.nativeElement.classList.replace("col-2", "hidden");
        this.productsContainer.nativeElement.classList.remove("hidden");
      } else {
        this.filtersContainer.nativeElement.classList.add("col-12");
        this.filtersContainer.nativeElement.classList.replace("hidden", "col-2");
        this.productsContainer.nativeElement.classList.add("hidden")
      }
    } else if(isFilterVisible ) {
        this.filtersContainer.nativeElement.classList.replace("col-2", "hidden");
        this.productsContainer.nativeElement.classList.replace("col-10", "col-12");
      } else {
        this.filtersContainer.nativeElement.classList.replace("hidden", "col-2");
        this.productsContainer.nativeElement.classList.replace("col-12", "col-10");
      }
  }

  async applyFilter(value: string) {
    this.products = await (firstValueFrom(this.productService.getLikeName(value)));
  }

  async applyPriceFilter(value: number[]) {
    this.products = await (firstValueFrom(this.productService.getBetweenPrice(value[0], value[1])));
  }

}
