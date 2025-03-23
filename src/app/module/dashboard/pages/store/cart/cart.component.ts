import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { Category } from '@models/data/category.model';
import { Purchase, PurchaseCart, PurchaseHasProduct } from '@models/data/purchase.model';
import { AccordionModule } from 'primeng/accordion';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { Product } from '@models/data/product.model';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ErrorMessage } from '@models/data/general.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AccordionModule, DividerModule, SkeletonModule, MessageModule, ToastModule, ButtonComponent],
  templateUrl: './cart.component.html',
  providers: [MessageService]
})
export class CartComponent implements OnInit {

  purchases: Signal<Purchase[]> = computed(() => this.purchaseService.purchases());
  carts: PurchaseCart[] =[];
  categories: Signal<Category[]> = computed(() => this.categoryService.categories());
  products: Signal<Product[]> = computed(() => this.productService.products());

  userId: number = 0;

  isLoading = true;

  constructor(
    private router: Router,
    private injector: Injector,
    private sessionService: SessionService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.findUserId();
    this.extractCarts();
  }

  findUserId() {
    this.userId = this.sessionService.getUserId();
  }

  extractCarts() {
    effect(() => {
      this.isLoading = false;
      if(this.purchases().length == 0) return;
      this.carts = this.purchases().filter((purchase) => purchase.state == 'cart' && purchase.userId == this.userId);
      this.savePurchases();
    }, {injector: this.injector})
  }

  savePurchases() {
    this.carts.forEach((cart) => {
      cart.category = this.categories().find(category => category.id == cart.categoryId);
      cart.products = cart.products.map(product => {
        product.product = this.products().find(prod => prod.id == product.id.productId);
        return product;
      })
    })
  }

  plusProductToCart(product: PurchaseHasProduct) {
    product.quantity += 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      next: () => { },
      error: (error: ErrorMessage) => {
        product.quantity -= 1;
        this.messageService.add({severity: 'warn', summary: 'Alerta', detail: error.detail});
      }
    })
  }

  minusProductToCart(product: PurchaseHasProduct) {
    product.quantity -= 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      next: () => { },
      error: (error: ErrorMessage) => {
        if(error.code === 404) {
          product.quantity += 1;
        }
      }
    })
  }

  deleteFromCart(product: PurchaseHasProduct) {
    this.purchaseService.deletePurchaseHasProductById(product.id).subscribe({
      next: () => { },
      error: (error) => {
        console.log('Ha ocurrio un error al eliminar el articulo del carrito.', error);
      },
      complete() {
        console.log('Articulo removido del carrito.');
      },
    })
  }

  goToStore(categoryId: number) {
    this.router.navigateByUrl(`/dashboard/store/products/${categoryId}`)
  }

}
