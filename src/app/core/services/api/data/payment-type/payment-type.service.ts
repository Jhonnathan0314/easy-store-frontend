import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentType } from '@models/data/payment-type.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypeService {

  apiUrl: string = '';

  private paymentTypes: PaymentType[] = [];
  private paymentTypesSubject = new BehaviorSubject<PaymentType[]>(this.paymentTypes);
  storedPaymentTypes$: Observable<PaymentType[]> = this.paymentTypesSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAll();
  }

  private findAll() {
    const accountId = this.sessionService.getUserId();
    this.http.get<ApiResponse<PaymentType[]>>(`${this.apiUrl}/payment-type/account/${accountId}`).subscribe({
      next: (apiResponse) => {
        this.paymentTypes = apiResponse.data;
        this.paymentTypesSubject.next(this.paymentTypes);
      },
      error: (error) => {
        console.log("error finding payment types: ", error);
      }
    })
  }

  getAll(): Observable<PaymentType[]> {
    return this.storedPaymentTypes$.pipe();
  }

  getById(id: number): Observable<PaymentType | undefined> {
    return this.storedPaymentTypes$.pipe(
      map(paymentTypes => paymentTypes.find(pay => pay.id === id))
    );
  }

  create(paymentType: PaymentType): Observable<ApiResponse<PaymentType>> {
    const userId = this.sessionService.getUserId();
    paymentType.accountId = this.sessionService.getAccountId();
    return this.http.post<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type`, paymentType, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        this.paymentTypes.push(response.data);
        this.paymentTypesSubject.next(this.paymentTypes);
      })
    )
  }

  update(paymentType: PaymentType): Observable<ApiResponse<PaymentType>> {
    const userId = this.sessionService.getUserId();
    paymentType.accountId = this.sessionService.getAccountId();
    return this.http.put<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type`, paymentType, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        const index = this.paymentTypes.findIndex(pay => pay.id == paymentType?.id);
        this.paymentTypes[index] = response.data;
        this.paymentTypesSubject.next(this.paymentTypes);
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/payment-type/delete/${id}`).subscribe({
      next: (response) => {
        this.paymentTypesSubject.next(this.paymentTypes.filter(pay => pay.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar tipo de pago.", error);
      }
    })
  }

}
