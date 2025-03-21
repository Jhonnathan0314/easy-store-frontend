import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase, PurchaseHasProduct, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  apiUrl: string = '';

  private purchases: Purchase[] = [];
  private purchasesSubject = new ReplaySubject<Purchase[]>(1);
  storedPurchases$: Observable<Purchase[]> = this.purchasesSubject.asObservable();
  
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
        this.purchases = purchases;
        this.purchasesSubject.next(this.purchases);
      }),
      catchError((error: ApiResponse<ErrorMessage>) => throwError(() => error))
    ).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.purchasesSubject.error(error); 
      }
    })
  }

  generate(purchase: PurchaseRq): Observable<ApiResponse<Purchase>> {
    const userId = this.sessionService.getUserId();
    purchase.userId = userId;
    return this.http.post<ApiResponse<Purchase>>(`${this.apiUrl}/purchase`, purchase, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        this.purchases.push(response.data);
        this.purchasesSubject.next(this.purchases);
      })
    )
  }

  update(purchase: Purchase): Observable<ApiResponse<Purchase>> {
    const userId = this.sessionService.getUserId();
    purchase.userId = userId;
    return this.http.put<ApiResponse<Purchase>>(`${this.apiUrl}/purchase`, purchase, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        const index = this.purchases.findIndex(pur => pur.id == purchase?.id);
        this.purchases[index] = response.data;
        this.purchasesSubject.next(this.purchases);
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase/delete/${id}`).subscribe({
      next: () => {
        this.purchasesSubject.next(this.purchases.filter(pur => pur.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar compra.", error);
      }
    })
  }

  addPurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<ApiResponse<PurchaseHasProduct>> {
    return this.http.post<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct)
    .pipe(
      tap(response => {
        const purchaseIndex = this.purchases.findIndex(purchase => purchase.id == purchaseHasProduct.id.purchaseId);
        const productIndex = this.purchases[purchaseIndex].products.findIndex(hasProduct => hasProduct.id.productId == purchaseHasProduct.id.productId);
        if(productIndex == -1) {
          this.purchases[purchaseIndex].products.push(response.data);
        }else {
          this.purchases[purchaseIndex].products[productIndex] = response.data;
        }
        this.purchasesSubject.next(this.purchases);
      })
    );
  }

  updatePurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<ApiResponse<PurchaseHasProduct>> {
    return this.http.put<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct)
    .pipe(
      tap(response => {
        const purchaseIndex = this.purchases.findIndex(purchase => purchase.id == purchaseHasProduct.id.purchaseId);
        const productIndex = this.purchases[purchaseIndex].products.findIndex(prod => prod.id.productId == purchaseHasProduct.id.productId);
        this.purchases[purchaseIndex].products[productIndex] = response.data;
        this.purchasesSubject.next(this.purchases);
        this.productService.findById(purchaseHasProduct.id.productId);
      })
    );
  }

  deletePurchaseHasProductById(id: PurchaseHasProductId): Observable<ApiResponse<object>> {
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase-has-product/purchase/${id.purchaseId}/product/${id.productId}`)
    .pipe(
      tap(response => {
        const purchaseIndex = this.purchases.findIndex(purchase => purchase.id == id.purchaseId);
        this.purchases[purchaseIndex].products = this.purchases[purchaseIndex].products.filter(product => product.id.productId != id.productId);
        this.purchasesSubject.next(this.purchases);
        return response
      })
    );
  }

}
