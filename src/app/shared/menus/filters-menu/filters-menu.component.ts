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
  
  canFilter: boolean = false;
  canCleanFilter: boolean = false;
  isLoading: boolean = false;

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
}
