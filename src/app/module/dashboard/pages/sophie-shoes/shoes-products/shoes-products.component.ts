import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-shoes-products',
  templateUrl: './shoes-products.component.html',
  styleUrls: ['./shoes-products.component.css'],
  providers: [ MessageService ]
})
export class ShoesProductsComponent {

  @ViewChild("filtersRef") filtersContainer: ElementRef;
  @ViewChild("productsRef") productsContainer: ElementRef;
  
  products: Product[] = [];

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

}
