import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Purchase, PurchaseHasProduct, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  apiUrl: string = '';

  purchases = signal<Purchase[]>([]);
  purchasesError = signal<ErrorMessage | null>(null)
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService,
    private productService: ProductService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAllByUser();
  }
  
  private findAllByUser() {
    const userId = this.sessionService.getUserId();
    this.http.get<ApiResponse<Purchase[]>>(`${this.apiUrl}/purchase/user/${userId}`).pipe(
      map(response => response.data),
      tap(purchases => {
        this.purchases.set(purchases);
      }),
      catchError((error: ApiResponse<ErrorMessage>) => {
        this.purchasesError.set(error.error);
        return throwError(() => error);
      })
    ).subscribe()
  }

  generate(purchase: PurchaseRq): Observable<Purchase> {
    const userId = this.sessionService.getUserId();
    purchase.userId = userId;
    return this.http.post<ApiResponse<Purchase>>(`${this.apiUrl}/purchase`, purchase, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(purchaseCreated => {
        this.purchases.update(() => [...this.purchases(), purchaseCreated])
      })
    )
  }

  update(purchase: Purchase): Observable<Purchase> {
    const userId = this.sessionService.getUserId();
    purchase.userId = userId;
    return this.http.put<ApiResponse<Purchase>>(`${this.apiUrl}/purchase`, purchase, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(purchaseUpdated => {
        this.purchases.update(purchases => purchases.map(pur => pur.id === purchase.id 
          ? purchaseUpdated 
          : pur
        ));
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase/delete/${id}`).pipe(
      tap(() => {
        this.purchases.update(pur => pur.filter(pur => pur.id != id));
      })
    ).subscribe()
  }

  addPurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<PurchaseHasProduct> {
    return this.http.post<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct)
    .pipe(
      map(response => response.data),
      tap(hasProduct => {
        this.purchases.update(purchases => {
          const purchaseIndex = purchases.findIndex(p => p.id === purchaseHasProduct.id.purchaseId);
          if (purchaseIndex !== -1) {
            const purchase = { ...purchases[purchaseIndex] };
            const products = [...purchase.products];
            const productIndex = products.findIndex(prod => prod.id.productId === purchaseHasProduct.id.productId);
            if (productIndex === -1) {
              products.push(hasProduct);
            } else {
              products[productIndex] = hasProduct;
            }
            purchase.products = products;
            purchases[purchaseIndex] = purchase;
          }
          return [...purchases];
        });
      })
    );
  }

  updatePurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<PurchaseHasProduct> {
    return this.http.put<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct)
    .pipe(
      map(response => response.data),
      tap(hasProduct => {
        this.purchases.update(purchases => {
          const purchaseIndex = purchases.findIndex(p => p.id === purchaseHasProduct.id.purchaseId);
          if (purchaseIndex !== -1) {
            const purchase = { ...purchases[purchaseIndex] };
            const products = [...purchase.products];
            const productIndex = products.findIndex(prod => prod.id.productId === purchaseHasProduct.id.productId);
            if (productIndex !== -1) {
              products[productIndex] = hasProduct;
            }
            purchase.products = products;
            purchases[purchaseIndex] = purchase;
          }
          return [...purchases];
        });
  
        this.productService.findById(purchaseHasProduct.id.productId);
      })
    );
  }

  deletePurchaseHasProductById(id: PurchaseHasProductId): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase-has-product/purchase/${id.purchaseId}/product/${id.productId}`)
    .pipe(
      tap(() => {
        this.purchases.update(purchases => {
          const purchaseIndex = purchases.findIndex(p => p.id === id.purchaseId);
          if (purchaseIndex !== -1) {
            const purchase = { ...purchases[purchaseIndex] };
            purchase.products = purchase.products.filter(prod => prod.id.productId !== id.productId);
            purchases[purchaseIndex] = purchase;
          }
          return [...purchases];
        });
      })
    );
  }

}
