import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { Purchase, PurchaseHasProduct, PurchaseHasProductId, PurchaseHasProductRq, PurchaseRq } from '@models/data/purchase.model';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { ProductService } from '../product/product.service';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  purchases = signal<Purchase[]>([]);
  purchasesError = signal<ErrorMessage | null>(null)
  
  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService,
    private productService: ProductService
  ) {
    this.purchases.set([]);
    this.purchasesError.set(null);
    this.validateRole();
  }
  
  validateRole() {
    effect(() => {
      if(!this.session() || this.session()?.role === '') return;
      this.findAllByUser();
    }, {injector: this.injector, allowSignalWrites: true})
  }
  
  private findAllByUser() {
    this.loadingService.push('purchase findAllByUser');

    const userId = this.sessionService.getUserId();

    this.http.get<ApiResponse<Purchase[]>>(`${this.apiUrl}/purchase/user/${userId}`).pipe(
      map(response => response.data),
      tap(purchases => {
        this.purchases.update(() => purchases);
        this.purchasesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.purchasesError.update(() => error.error.error);
        this.purchases.update(() => []);
        return throwError(() => error.error);
      }),
      finalize(() => this.loadingService.drop('purchase findAllByUser'))
    ).subscribe()
  }

  generate(purchase: PurchaseRq): Observable<Purchase> {
    this.workingService.push('purchase generate');

    const userId = this.sessionService.getUserId();
    purchase.userId = userId;

    return this.http.post<ApiResponse<Purchase>>(`${this.apiUrl}/purchase`, purchase, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(purchaseCreated => {
        this.purchases.update(() => [...this.purchases(), purchaseCreated])
      }),
      finalize(() => this.workingService.drop('purchase generate'))
    )
  }

  update(purchase: Purchase): Observable<Purchase> {
    this.workingService.push('purchase update');

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
      }),
      finalize(() => this.workingService.drop('purchase update'))
    )
  }

  deleteById(id: number) {
    this.workingService.push('purchase deleteById');

    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase/delete/${id}`).pipe(
      tap(() => {
        this.purchases.update(pur => pur.filter(pur => pur.id != id));
        if(this.purchases().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay compras.',
            detail: 'No se encontraron compras.'
          };
          this.purchasesError.update(() => error)
        }
      }),
      finalize(() => this.workingService.drop('purchase deleteById'))
    ).subscribe()
  }

  addPurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<PurchaseHasProduct> {
    this.workingService.push('purchase-has-product add');

    return this.http.post<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct).pipe(
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
            purchases[purchaseIndex].total = products.map(prod => prod.quantity * prod.unitPrice).reduce((a, b) => a + b, 0);
          }
          return [...purchases];
        });
      }),
      finalize(() => this.workingService.drop('purchase-has-product add'))
    );
  }

  updatePurchaseHasProduct(purchaseHasProduct: PurchaseHasProductRq): Observable<PurchaseHasProduct> {
    this.workingService.push('purchase-has-product update');

    return this.http.put<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct).pipe(
      map(response => response.data),
      tap(hasProduct => {
        this.purchases.update(purchases => {
          const purchaseIndex = purchases.findIndex(p => p.id === purchaseHasProduct.id.purchaseId);
          if (purchaseIndex !== -1) {
            const purchaseUpdated = { ...purchases[purchaseIndex] };
            const productsUpdated = [...purchaseUpdated.products];
            const productUpdatedIndex = productsUpdated.findIndex(prod => prod.id.productId === purchaseHasProduct.id.productId);
            if (productUpdatedIndex !== -1) {
              productsUpdated[productUpdatedIndex] = hasProduct;
            }
            purchaseUpdated.products = productsUpdated;
            purchases[purchaseIndex] = purchaseUpdated;
            purchases[purchaseIndex].total = productsUpdated.map(prod => prod.quantity * prod.unitPrice).reduce((a, b) => a + b, 0);
          }
          return [...purchases];
        });
        this.productService.findById(purchaseHasProduct.id.productId).subscribe();
      }),
      catchError((error) => {
        return throwError(() => error.error.error)
      }),
      finalize(() => this.workingService.drop('purchase-has-product update'))
    );
  }

  deletePurchaseHasProductById(id: PurchaseHasProductId): Observable<ApiResponse<object>> {
    this.workingService.push('purchase-has-product delete');

    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/purchase-has-product/purchase/${id.purchaseId}/product/${id.productId}`).pipe(
      tap(() => {
        this.purchases.update(purchases => {
          const purchaseIndex = purchases.findIndex(p => p.id === id.purchaseId);
          if (purchaseIndex !== -1) {
            const purchase = { ...purchases[purchaseIndex] };
            purchase.products = purchase.products.filter(prod => prod.id.productId !== id.productId);
            purchase.total = purchase.products.map(prod => prod.quantity * prod.unitPrice).reduce((a, b) => a + b, 0);
            purchases[purchaseIndex] = purchase;
          }
          return [...purchases];
        });
      }),
      finalize(() => this.workingService.drop('purchase-has-product delete'))
    );
  }

}
