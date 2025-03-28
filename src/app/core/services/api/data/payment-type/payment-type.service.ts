import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { PaymentType } from '@models/data/payment-type.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypeService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  paymentTypes = signal<PaymentType[]>([]);
  paymentTypesError = signal<ErrorMessage | null>(null);
  
  role: Signal<string> = computed(() => this.sessionService.role());

  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private sessionService: SessionService
  ) {
    this.paymentTypes.set([]);
    this.paymentTypesError.set(null);
    this.validateRole();
  }
  
  validateRole() {
    effect(() => {
      if(this.role() === '') return;
      if(this.role() === 'admin') this.findAllByAccountId();
    }, {injector: this.injector})
  }

  findAllByAccountId(accountId?: number) {
    const accountIdStorage = this.sessionService.getUserId();
    this.http.get<ApiResponse<PaymentType[]>>(`${this.apiUrl}/payment-type/account/${accountId ?? accountIdStorage}`).pipe(
      map(response => response.data),
      tap(paymentTypes => {
        this.paymentTypes.update(() => paymentTypes);
        this.paymentTypesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.paymentTypesError.update(() => error.error.error);
        this.paymentTypes.update(() => []);
        return throwError(() => error)
      })
    ).subscribe()
  }

  getById(id: number): Signal<PaymentType | undefined> {
    return computed(() => this.paymentTypes().find(pay => pay.id === id));
  }

  create(paymentType: PaymentType): Observable<PaymentType> {
    const userId = this.sessionService.getUserId();
    paymentType.accountId = this.sessionService.getAccountId();
    return this.http.post<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type`, paymentType, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(paymentTypeCreated => {
        this.paymentTypes.update(payments => [...payments, paymentTypeCreated]);
      }),
      catchError((error) => throwError(() => error.error))
    )
  }

  update(paymentType: PaymentType): Observable<PaymentType> {
    const userId = this.sessionService.getUserId();
    paymentType.accountId = this.sessionService.getAccountId();
    return this.http.put<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type`, paymentType, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(paymentTypeUpdated => {
        this.paymentTypes.update(types => types.map(type => type.id === paymentType.id 
          ? paymentTypeUpdated 
          : type
        ));
      }),
      catchError((error) => throwError(() => error.error))
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/payment-type/delete/${id}`).pipe(
      tap(() => {
        this.paymentTypes.update(types => types.filter(type => type.id != id));
        if(this.paymentTypes().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay tipos de pago.',
            detail: 'No se encontraron tipos de pago.'
          };
          this.paymentTypesError.update(() => error)
        }
      }),
      catchError((error) => throwError(() => error.error))
    ).subscribe()
  }

}
