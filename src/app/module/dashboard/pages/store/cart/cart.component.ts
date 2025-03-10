import { Component, OnInit } from '@angular/core';
import { Category } from '@models/data/category.model';
import { Purchase } from '@models/data/purchase.model';
import { AccordionModule } from 'primeng/accordion';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { SessionService } from 'src/app/core/services/session/session.service';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AccordionModule, ButtonComponent],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  carts: Purchase[] = [];
  categories: Category[] = [];

  userId: number = 0;

  purchaseSubscription: Subscription;
  categorySubscription: Subscription;

  constructor(
    private sessionService: SessionService,
    private categoryService: CategoryService,
    private purchaseService: PurchaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.findUserId();
    this.categorySubscribe();
    this.purchaseSubscribe();
  }

  findUserId() {
    this.userId = this.sessionService.getUserId();
  }

  categorySubscribe() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando categorias.', {error});
      }
    })
  }

  purchaseSubscribe() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        this.carts = purchases.filter((purchase) => purchase.state == 'cart' && purchase.userId == this.userId);
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando compras.', {error});
      }
    })
  }

  goToStore(categoryId: number) {
    this.router.navigateByUrl(`/dashboard/store/products/${categoryId}`)
  }

}
