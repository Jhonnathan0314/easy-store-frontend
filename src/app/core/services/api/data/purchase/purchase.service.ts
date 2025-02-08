import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '@models/data/purchase.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  apiUrl: string = '';

  private purchases: Purchase[] = [];
  private purchasesSubject = new BehaviorSubject<Purchase[]>(this.purchases);
  storedPurchases$: Observable<Purchase[]> = this.purchasesSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAll();
  }

  private findAll() {
    const accountId = this.sessionService.getUserId();
    this.http.get<ApiResponse<Purchase[]>>(`${this.apiUrl}/purchase/account/${accountId}`).subscribe({
      next: (apiResponse) => {
        this.purchases = apiResponse.data;
        this.purchasesSubject.next(this.purchases);
      },
      error: (error) => {
        console.log("error finding purchases: ", error);
      }
    })
  }

  getAll(): Observable<Purchase[]> {
    return this.storedPurchases$.pipe();
  }

  getById(id: number): Observable<Purchase | undefined> {
    return this.storedPurchases$.pipe(
      map(purchases => purchases.find(purchase => purchase.id === id))
    );
  }

  generate(purchase: Purchase): Observable<ApiResponse<Purchase>> {
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
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/purchase/delete/${id}`).subscribe({
      next: (response) => {
        this.purchasesSubject.next(this.purchases.filter(pur => pur.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar compra.", error);
      }
    })
  }

}
