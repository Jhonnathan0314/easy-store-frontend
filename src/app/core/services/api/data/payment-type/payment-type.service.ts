import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Injector, Signal, signal } from '@angular/core';
import { PaymentType } from '@models/data/payment-type.model';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypeService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  paymentTypes = signal<PaymentType[]>([]);
  paymentTypesError = signal<ErrorMessage | null>(null);
  
  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {
    this.paymentTypes.set([]);
    this.paymentTypesError.set(null);
    this.validateRole();
  }
  
  validateRole() {
    if(this.session()?.role === 'admin') this.findAll();
    if(this.session()?.role === 'owner') this.findAllActive();
  }

  findAll() {
    this.loadingService.push('payment-type findAll');

    this.http.get<ApiResponse<PaymentType[]>>(`${this.apiUrl}/payment-type`).pipe(
      map(response => response.data),
      tap(paymentTypes => {
        this.paymentTypes.update(() => paymentTypes);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.paymentTypesError.update(() => error.error.error);
        this.paymentTypes.update(() => []);
        return throwError(() => error)
      }),
      finalize(() => this.loadingService.drop('payment-type findAll'))
    ).subscribe()
  }

  findAllActive() {
    this.loadingService.push('payment-type findAllActive');

    this.http.get<ApiResponse<PaymentType[]>>(`${this.apiUrl}/payment-type/active`).pipe(
      map(response => response.data),
      tap(paymentTypes => {
        this.paymentTypes.update(() => paymentTypes);
        this.paymentTypesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.paymentTypesError.update(() => error.error.error);
        this.paymentTypes.update(() => []);
        return throwError(() => error)
      }),
      finalize(() => this.loadingService.drop('payment-type findAllActive'))
    ).subscribe()
  }

  getById(id: number): Signal<PaymentType | undefined> {
    return computed(() => this.paymentTypes().find(pt => pt.id === id));
  }

  create(paymentType: PaymentType): Observable<PaymentType> {
    this.workingService.push('payment-type create');

    const userId = this.session()?.userId ?? -1;

    return this.http.post<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type`, paymentType, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(paymentTypeCreated => {
        this.paymentTypes.update(payments => [...payments, paymentTypeCreated]);
      }),
      catchError((error) => throwError(() => error.error)),
      finalize(() => this.workingService.drop('payment-type create'))
    )
  }

  update(paymentType: PaymentType): Observable<PaymentType> {
    this.workingService.push('payment-type update');

    const userId = this.session()?.userId ?? -1;

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
      catchError((error) => throwError(() => error.error)),
      finalize(() => this.workingService.drop('payment-type update'))
    )
  }

  changeStatePaymentType(id: number): Observable<PaymentType> {
    this.workingService.push('payment-type changeStatePaymentType');

    const userId = this.session()?.userId ?? -1;

    return this.http.delete<ApiResponse<PaymentType>>(`${this.apiUrl}/payment-type/change-state/${id}`, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      map((response) =>  response.data),
      tap((paymentType) => this.paymentTypes.update(types => types.map(type => type.id === paymentType.id ? paymentType : type))),
      catchError((error) => throwError(() => error.error)),
      finalize(() => this.workingService.drop('payment-type changeStatePaymentType'))
    )
  }

}
