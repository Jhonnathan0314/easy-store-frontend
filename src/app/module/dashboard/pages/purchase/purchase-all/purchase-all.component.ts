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

@Component({
  selector: 'app-purchase-all',
  standalone: true,
  imports: [ButtonComponent, TableComponent],
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
    this.openPaymentTypeSubscription();
    this.openCategorySubscription();
    this.openProductSubscription();
    this.openPurchaseSubscription();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  openUserSubscription() {
    this.userSubscription = this.userService.storedUsers$.subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando usuarios.', {error});
      }
    })
  }

  openPaymentTypeSubscription() {
    this.paymentTypeSubscription = this.paymentTypeService.storedPaymentTypes$.subscribe({
      next: (paymentTypes) => {
        this.paymentTypes = paymentTypes;
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando tipos de pago.', {error});
      }
    })
  }

  openCategorySubscription() {
    this.categorySubscription = this.categoryService.storedCategories$.subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando categorias.', {error});
      }
    })
  }

  openProductSubscription() {
    this.productSubscription = this.productService.storedProducts$.subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando productos.', {error});
      }
    })
  }

  openPurchaseSubscription() {
    this.purchaseSubscription = this.purchaseService.storedPurchases$.subscribe({
      next: (purchases) => {
        this.purchases = purchases;
        this.convertToDataObject();
      },
      error: (error) => {
        console.log('Ha ocurrido un error consultando compras.', {error});
      }
    })
  }

  closeSubscriptions() {
    this.userSubscription.unsubscribe();
    this.paymentTypeSubscription.unsubscribe();
    this.categorySubscription.unsubscribe;
    this.productSubscription.unsubscribe();
    this.purchaseSubscription.unsubscribe();
  }

  convertToDataObject() {
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
    console.log({mappedPurchases: this.mappedPurchases});
  }

  deleteById(purchase: DataObject) {
    this.purchaseService.deleteById(purchase.purchase?.id ?? 0);
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }

}
