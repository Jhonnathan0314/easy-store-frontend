import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseHasProduct, PurchaseHasProductId } from '@models/data/purchase.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseHasProductService {

  apiUrl: string = '';
  
  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
  }

  add(purchaseHasProduct: PurchaseHasProduct): Observable<ApiResponse<PurchaseHasProduct>> {
    return this.http.post<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct);
  }

  update(purchaseHasProduct: PurchaseHasProduct): Observable<ApiResponse<PurchaseHasProduct>> {
    return this.http.put<ApiResponse<PurchaseHasProduct>>(`${this.apiUrl}/purchase-has-product`, purchaseHasProduct);
  }

  deleteById(id: PurchaseHasProductId): Observable<ApiResponse<Object>> {
    return this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/purchase-has-product/purchase/${id.purchaseId}/product/${id.productId}`);
  }

}
