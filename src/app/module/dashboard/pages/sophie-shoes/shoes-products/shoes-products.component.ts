import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';
import { ProductService } from 'src/app/core/services/product/product.service';

@Component({
  selector: 'app-shoes-products',
  templateUrl: './shoes-products.component.html',
  styleUrls: ['./shoes-products.component.css']
})
export class ShoesProductsComponent implements OnInit {

  @ViewChild("filtersRef") filtersContainer: ElementRef;
  @ViewChild("productsRef") productsContainer: ElementRef;
  
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getAllProducts();
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
    } else {
      if(isFilterVisible ) {
        this.filtersContainer.nativeElement.classList.replace("col-2", "hidden");
        this.productsContainer.nativeElement.classList.replace("col-10", "col-12");
      } else {
        this.filtersContainer.nativeElement.classList.replace("hidden", "col-2");
        this.productsContainer.nativeElement.classList.replace("col-12", "col-10");
      }
    }
  }

}
