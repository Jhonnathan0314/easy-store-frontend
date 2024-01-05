import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.css']
})
export class FiltersMenuComponent {

  @ViewChild("shoesRef") shoesContainer: ElementRef;
  @ViewChild("lingerieRef") lingerieContainer: ElementRef;
  @ViewChild("clothesRef") clothesContainer: ElementRef;
  @ViewChild("accesoriesRef") accesoriesContainer: ElementRef;

  @Output() displayFiltersEvent = new EventEmitter<void>();
  @Output() priceFilterEvent = new EventEmitter<number[]>();
  @Output() subcategoryFilterEvent = new EventEmitter<string>();

  canFilter: boolean = false;
  canCleanFilter: boolean = false;
  isLoading: boolean = false;

  minPrice: number = 0;
  maxPrice: number = 0;

  showCategory(categoryName: string) {
    if(categoryName == 'shoes') this.changeFilterClass(this.shoesContainer);
    if(categoryName == 'lingerie') this.changeFilterClass(this.lingerieContainer);
    if(categoryName == 'clothes') this.changeFilterClass(this.clothesContainer);
    if(categoryName == 'accesories') this.changeFilterClass(this.accesoriesContainer);
  }

  changeFilterClass(container: ElementRef) {
    const isHidden = container.nativeElement.classList.contains("hidden");
    if(isHidden){
      container.nativeElement.classList.remove("hidden");
    }else {
      container.nativeElement.classList.add("hidden");
    }
  }

  hideFiltersEvent() {
    this.displayFiltersEvent.emit();
  }

  cleanFilters() {
    this.minPrice = 0;
    this.maxPrice = 0;
  }

  validateCanFilter() {
    this.canFilter = this.minPrice != undefined && this.minPrice != null && this.maxPrice > 0;
  }

  validateCanCleanFilter() {
    this.canCleanFilter = (this.minPrice != undefined && this.minPrice != null && this.minPrice != 0) || this.maxPrice > 0;
  }

  receiveValue(value: number, field: string) {
    if(field == 'min') this.minPrice = value;
    if(field == 'max') this.maxPrice = value;
  }

  filterByRangePrice() {
    if(this.canFilter) this.priceFilterEvent.emit([this.minPrice, this.maxPrice]);
  }

  filterBySubcategory(subcategory: string) {
    this.subcategoryFilterEvent.emit(subcategory);
  }

}
