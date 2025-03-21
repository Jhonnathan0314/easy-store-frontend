import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '@models/data/category.model';
import { PurchaseCart, PurchaseHasProduct } from '@models/data/purchase.model';
import { AccordionModule } from 'primeng/accordion';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { Product } from '@models/data/product.model';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AccordionModule, DividerModule, SkeletonModule, ButtonComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {

  carts: PurchaseCart[] = [];
  categories: Category[] = [];
  products: Product[] = [];

  userId: number = 0;

  isLoading = true;

  purchaseSubscription: Subscription;
  categorySubscription: Subscription;
  productSubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.findUserId();
    this.categorySubscribe();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  closeSubscriptions() {
    if(this.categorySubscription)
      this.categorySubscription.unsubscribe();
    if(this.purchaseSubscription)
      this.purchaseSubscription.unsubscribe();
    if(this.productSubscription)
      this.productSubscription.unsubscribe();
  }

  findUserId() {
    this.userId = this.sessionService.getUserId();
  }

  categorySubscribe() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        if(categories.length == 0) return;
        this.categories = categories;
        this.purchaseSubscribe();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.categories = [];
        }
        this.isLoading = false;
      }
    })
  }

  purchaseSubscribe() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        if(purchases.length == 0) return;
        this.carts = purchases.filter((purchase) => purchase.state == 'cart' && purchase.userId == this.userId);
        this.productSubscribe();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.carts = [];
        }
        this.isLoading = false;
      }
    })
  }

  productSubscribe() {
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        if(products.length == 0) return;
        this.products = products;
        this.savePurchases();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.products = [];
        }
        this.isLoading = false;
      }
    })
  }

  savePurchases() {
    this.carts.forEach((cart) => {
      cart.category = this.categories.find(category => category.id == cart.categoryId);
      cart.products = cart.products.map(product => {
        product.product = this.products.find(prod => prod.id == product.id.productId);
        return product;
      })
    })
  }

  plusProductToCart(product: PurchaseHasProduct) {
    product.quantity += 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      next: () => { },
      error: () => {
        console.log('Ha ocurrio un error al actualizar el articulo del carrito.');
      }
    })
  }

  minusProductToCart(product: PurchaseHasProduct) {
    product.quantity -= 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      next: () => { },
      error: () => {
        console.log('Ha ocurrio un error al actualizar el articulo del carrito.');
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
