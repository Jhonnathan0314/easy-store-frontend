import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/inputs/button/button.component";
import { TableComponent } from "../../../../../shared/data/table/table.component";
import { Purchase, PurchaseHasProduct, PurchaseMap } from '@models/data/purchase.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { User } from '@models/security/user.model';
import { PaymentType } from '@models/data/payment-type.model';
import { Category } from '@models/data/category.model';
import { Product } from '@models/data/product.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PaymentTypeService } from 'src/app/core/services/api/data/payment-type/payment-type.service';
import { CategoryService } from 'src/app/core/services/api/data/category/category.service';
import { ProductService } from 'src/app/core/services/api/data/product/product.service';
import { PurchaseService } from 'src/app/core/services/api/data/purchase/purchase.service';
import { UserService } from 'src/app/core/services/api/data/user/user.service';
import { PurchaseReportComponent } from "../purchase-report/purchase-report.component";
import { LoadingTableComponent } from '@component/shared/skeleton/loading-table/loading-table.component';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Component({
  selector: 'app-purchase-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent, LoadingTableComponent, PurchaseReportComponent],
  templateUrl: './purchase-all.component.html'
})
export class PurchaseAllComponent {
  
  mappedPurchases: DataObject[] = [];
  
  users: User[] = [];
  paymentTypes: PaymentType[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  purchases: Purchase[] = [];

  purchaseMap = new PurchaseMap();
  user = new User();
  paymentType = new PaymentType();
  category = new Category();
  product = new Product();
  purchase = new Purchase();
  hasProducts: PurchaseHasProduct[] = [];

  userSubscription: Subscription;
  paymentTypeSubscription: Subscription;
  categorySubscription: Subscription;
  productSubscription: Subscription;
  purchaseSubscription: Subscription;

  isDetailSelected: boolean = false;
  detailSelectedId: number = 0;
  detailSelectedIndex: number = 0;

  viewChart: boolean = false;

  isLoading = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private paymentTypeService: PaymentTypeService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit(): void {
    this.openUserSubscription();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openUserSubscription() {
    this.userSubscription = this.userService.storedUsers$.subscribe({
      next: (users) => {
        if(users.length == 0) return;
        this.users = users;
        this.openPaymentTypeSubscription();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.users = [];
        }
        this.isLoading = false;
      }
    })
  }

  openPaymentTypeSubscription() {
    this.paymentTypeSubscription = this.paymentTypeService.storedPaymentTypes$.subscribe({
      next: (paymentTypes) => {
        if(paymentTypes.length == 0) return;
        this.paymentTypes = paymentTypes;
        this.openCategorySubscription();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.paymentTypes = [];
        }
        this.isLoading = false;
      }
    })
  }

  openCategorySubscription() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        if(categories.length == 0) return;
        this.categories = categories;
        this.openProductSubscription();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.categories = [];
        }
        this.isLoading = false;
      }
    })
  }

  openProductSubscription() {
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        if(products.length == 0) return;
        this.products = products;
        this.openPurchaseSubscription();
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.products = [];
        }
        this.isLoading = false;
      }
    })
  }

  openPurchaseSubscription() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        if(purchases.length == 0) return;
        this.purchases = purchases;
        this.convertToDataObject();
        this.isLoading = false;
      },
      error: (error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) {
          this.purchases = [];
        }
        this.isLoading = false;
      }
    })
  }

  closeSubscriptions() {
    if(this.userSubscription)
      this.userSubscription.unsubscribe();
    if(this.paymentTypeSubscription)
      this.paymentTypeSubscription.unsubscribe();
    if(this.categorySubscription)
      this.categorySubscription.unsubscribe();
    if(this.productSubscription)
      this.productSubscription.unsubscribe();
    if(this.purchaseSubscription)
      this.purchaseSubscription.unsubscribe();
  }

  convertToDataObject() {
    if(this.users.length === 0 || this.paymentTypes.length === 0 || 
      this.categories.length === 0 || this.products.length === 0 || 
      this.purchases.length === 0) return;
    this.mappedPurchases = this.purchases.map(purch => {
      this.user = this.users.find(us => us.id == purch.userId) ?? new User();
      this.paymentType = this.paymentTypes.find(pay => pay.id == purch.paymentTypeId) ?? new PaymentType();
      this.category = this.categories.find(cat => cat.id == purch.categoryId) ?? new Category();

      this.hasProducts = purch.products.filter(php => php.id.purchaseId === purch.id) || [];
      this.hasProducts = this.hasProducts.map(hasProd => {
        this.product = this.products.find(prod => prod.id === hasProd.id.productId) ?? new Product();
        this.purchase = this.purchases.find(pur => pur.id === hasProd.id.purchaseId) ?? new Purchase();
        return { 
          id: hasProd.id, 
          quantity: hasProd.quantity, 
          subtotal: hasProd.subtotal, 
          unitPrice: hasProd.unitPrice,
          product: this.product,
          purchase: this.purchase
        }
      })

      this.purchaseMap = {
        id: purch.id,
        user: this.user,
        paymentType: this.paymentType, 
        category: this.category,
        total: purch.total,
        state: purch.state,
        creationDate: purch.creationDate,
        products: this.hasProducts
      }
      return {
       purchase: this.purchaseMap
      }
    })
  }

  deleteById(purchase: DataObject) {
    this.purchaseService.deleteById(purchase.purchase?.id ?? 0);
  }

  viewDetail($event: number) {
    this.isDetailSelected = true;
    this.detailSelectedId = $event;
    this.detailSelectedIndex = this.mappedPurchases.findIndex(map => map.purchase?.id === $event);
  }

  eventViewChart() {
    this.viewChart = !this.viewChart;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
