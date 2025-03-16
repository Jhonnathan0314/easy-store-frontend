import { Component, OnInit } from '@angular/core';
import { Category } from '@models/data/category.model';
import { Purchase, PurchaseCart, PurchaseHasProduct } from '@models/data/purchase.model';
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

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AccordionModule, DividerModule, ButtonComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  carts: PurchaseCart[] = [];
  categories: Category[] = [];
  products: Product[] = [];

  userId: number = 0;

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
      error: (error) => {
        console.log('Ha ocurrido un error consultando categorias.', {error});
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
      error: (error) => {
        console.log('Ha ocurrido un error consultando compras.', {error});
      }
    })
  }

  productSubscribe() {
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        if(products.length == 0) return;
        this.products = products;
        this.savePurchases();
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando compras.', {error});
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
      next: (response) => { },
      error: (error) => {
        console.log('Ha ocurrio un error al actualizar el articulo del carrito.');
      }
    })
  }

  minusProductToCart(product: PurchaseHasProduct) {
    product.quantity -= 1;
    this.purchaseService.updatePurchaseHasProduct(product).subscribe({
      next: (response) => { },
      error: (error) => {
        console.log('Ha ocurrio un error al actualizar el articulo del carrito.');
      }
    })
  }

  deleteFromCart(product: PurchaseHasProduct) {
    this.purchaseService.deletePurchaseHasProductById(product.id).subscribe({
      next: (response) => { },
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
