import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputSelectComponent } from '@component/shared/inputs/input-select/input-select.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { Product } from '@models/data/product.model';
import { PrimeNGObject } from '@models/utils/primeng-object.model';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { Purchase } from '@models/data/purchase.model';
import { environment } from 'src/environments/environment';
import { cartHasProduct } from 'src/app/core/utils/validation/cart-validation.util';
import { ImagePipe } from 'src/app/core/pipes/image/image.pipe';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ImagePipe, DataViewModule, DividerModule, SelectButtonModule, TagModule, ButtonComponent, InputTextComponent, InputSelectComponent],
  templateUrl: './data-view.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']
})
export class DataViewComponent implements OnInit, OnChanges {

  @Output() addToCartEvent = new EventEmitter<Product>();
  @Output() removeFromCartEvent = new EventEmitter<Product>();
  @Output() goCartEvent = new EventEmitter<Product>();
  @Output() viewProductEvent = new EventEmitter<Product>();
  
  @Input() cart: Purchase = new Purchase();
  @Input() disableButtons: boolean = false;

  @Input() objects: Product[] = [];
  originalObjects: Product[] = [];

  layout: 'list' | 'grid' = 'list';
  layoutOptions = ['list', 'grid'];

  sortOptions: PrimeNGObject[] = [
    {
      value: 'none',
      name: 'Ninguno'
    },
    {
      value: 'lowPrice',
      name: 'Precio más bajo'

    }, 
    {
      value: 'highPrice',
      name: 'Precio más alto'
    }, 
    {
      value: 'lowQuantity',
      name: 'Menos cantidad'
    }, 
    {
      value: 'highQuantity',
      name: 'Más cantidad'
    }, 
    {
      value: 'lowQualification',
      name: 'Menor calificación'
    }, 
    {
      value: 'highQualification',
      name: 'Mayor calificación'
    }
  ];

  selectedSortOption = this.sortOptions[0].value;

  phoneNumber: string = '3125543042';

  PRODUCT_IMAGE_NAME: string = environment.DEFAULT_IMAGE_PRODUCT_NAME;

  ngOnInit(): void {
    if(!this.cart.products)
      this.cart.products = [];  
  }

  ngOnChanges(): void {
    this.originalObjects = [...this.objects];
  }

  getSeverity(product: Product) {
    if(product.quantity <= 5) {
      return 'warn';
    }
    if(product.quantity > 5) {
      return 'success';
    }
    if(product.quantity == 0) {
      return 'danger';
    }
    return 'warn'
  }

  receiveFilter(text: string) {
    text = text.toLowerCase();
    this.objects = this.originalObjects.filter(product => product.name.toLowerCase().includes(text) || product.description.includes(text));
  }

  receiveSort(text: string) {
    if(text == 'lowPrice') {
      this.objects = this.objects.sort((a, b) => a.price - b.price);
    }
    if(text == 'highPrice') {
      this.objects = this.objects.sort((a, b) => b.price - a.price);
    }
    if(text == 'lowQuantity') {
      this.objects = this.objects.sort((a, b) => a.quantity - b.quantity);
    }
    if(text == 'highQuantity') {
      this.objects = this.objects.sort((a, b) => b.quantity - a.quantity);
    }
    if(text == 'lowQualification') {
      this.objects = this.objects.sort((a, b) => a.qualification - b.qualification);
    }
    if(text == 'highQualification') {
      this.objects = this.objects.sort((a, b) => b.qualification - a.qualification);
    }
    if(text == 'none') {
      this.objects = [...this.originalObjects];
    }
  }

  cartHasProduct(product: Product): boolean {
    return cartHasProduct(this.cart, product);
  }

  addToCart(product: Product) {
    this.addToCartEvent.emit(product);
  }

  removeFromCart(product: Product) {
    this.removeFromCartEvent.emit(product);
  }

  goToCart() {
    this.goCartEvent.emit();
  }

  viewProduct(product: Product) {
    this.viewProductEvent.emit(product);
  }

  buyNow(product: Product) {
    window.open(`https://wa.me/+573202778890?text=Hola!%20%0A%0AVi%20el%20producto%20${product.name}%2E%20%0A%0AQuiero%20realizar%20la%20compra%2E%20%28id%20${product.id}%29`)
  }

}
