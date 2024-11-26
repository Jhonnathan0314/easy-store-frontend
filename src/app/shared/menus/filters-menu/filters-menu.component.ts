import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.css'],
  animations:[
    trigger('fadeInDown', [
      state('after-hidden', style({
        display: 'none'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-100%)'
      })),
      state('before-visible', style({
        opacity: 0,
        transform: 'translateX(-100%)',
        display: 'block'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0%)'
      })),
      transition('visible <=> hidden', [
        animate(300)
      ]),
      transition('hidden => after-hidden', [
        animate(0)
      ]),
      transition('before-visible => visible', [
        animate(300)
      ])
    ])
  ]
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

  fadeInDown: string[] = ['after-hidden', 'after-hidden', 'after-hidden', 'after-hidden']

  showCategory(pos: number) {
    this.fadeInDown[pos] = this.fadeInDown[pos] == 'after-hidden' ? 'before-visible' : 'hidden';
    if(this.fadeInDown[pos] == 'hidden') this.timeout(pos, "after-hidden", 300);
    if(this.fadeInDown[pos] == 'before-visible') this.timeout(pos, "visible", 0);
  }

  timeout(pos: number, value: string, time: number) {
    setTimeout(() => {
      this.fadeInDown[pos] = value;
    }, time);
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
    if(this.minPrice == undefined || this.minPrice == null) this.minPrice = 0;
    if(this.maxPrice == undefined || this.maxPrice == null) this.maxPrice = 0;
    this.canFilter = this.minPrice > 0 || this.maxPrice > 0;
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
