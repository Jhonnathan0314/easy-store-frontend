import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { Category, CategoryHasPaymentType, CategoryHasPaymentTypeId } from 'src/app/core/models/data-types/data/category.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/data-types/data/general.model';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../utils/session/session.service';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';
import { S3File } from '@models/utils/file.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  categories = signal<Category[]>([]);
  categoriesError = signal<ErrorMessage | null>(null);

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());
  
  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {
    this.categories.set([]);
    this.categoriesError.set(null);
    this.validateRole();
  }

  validateRole() {
    effect(() => {
      if(!this.session() || this.session()?.role === '') return;
      if(this.session()?.role === 'owner') {
        this.findAllByAccount();
      } else if (this.session()?.role === 'admin' || this.session()?.role === 'client' || this.session()?.role === 'ghost') {
        this.findAll();
      }
    }, {injector: this.injector, allowSignalWrites: true})
  }

  private findAllByAccount() {
    this.loadingService.push('category findAllByAccount');
    const accountId = this.session()?.accountId ?? -1;
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category/account/${accountId}?image=true`).pipe(
      map(response => response.data),
      tap(categories => {
        this.categories.update(() => categories);
        this.categoriesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.categoriesError.update(() => error.error.error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('category findAllByAccount'))
    ).subscribe();
  }

  private findAll() {
    this.loadingService.push('category findAll');
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category?image=true`).pipe(
      map(response => response.data),
      tap(categories => {
        this.categories.update(() => categories);
        this.categoriesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.categoriesError.update(() => error.error.error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('category findAll'))
    ).subscribe();
  }

  findById(id: number) {
    this.workingService.push(`category findById ${id}`);
    this.http.get<ApiResponse<Category>>(`${this.apiUrl}/category/${id}?image=true`).pipe(
      map(response => response.data),
      tap(category => {
        this.categories.update(categories => {
          const index = categories.findIndex(prod => prod.id === id);
          if (index === -1) {
            return [...categories, category];
          } else {
            return categories.map(cat => cat.id === id ? category : cat);
          }
        });
      }),
      finalize(() => this.workingService.drop(`category findById ${id}`))
    ).subscribe();
  }

  getById(id: number): Signal<Category | undefined> {
    return computed(() => this.categories().find(cat => cat.id === id));
  }

  create(category: Category): Observable<Category> {
    this.workingService.push('category create');

    category.userId = this.session()?.userId ?? -1;
    category.accountId = this.session()?.userId ?? -1;

    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: { 'Create-By': `${category.userId}` }
    }).pipe(
      map(response => response.data),
      tap(categoryCreated => {
        this.categories.update(cats => [...cats, categoryCreated]);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category create'))
    )
  }

  update(category: Category): Observable<Category> {
    this.workingService.push('category update');

    category.userId = this.session()?.userId ?? -1;
    category.accountId = this.session()?.accountId ?? -1;

    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Update-By': `${category.userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(categoryUpdated => {
        this.categories.update(cats => cats.map(cat => cat.id === categoryUpdated.id ? categoryUpdated : cat));
        return categoryUpdated;
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category update'))
    )
  }

  updateImg(id: number, image: S3File): Observable<Category> {
    this.workingService.push('category updateImg');

    const userId = this.session()?.userId ?? -1;

    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/category/${id}/img`, image, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(categoryUpdated => {
        this.categories.update(cats => cats.map(cat => cat.id === categoryUpdated.id ? categoryUpdated : cat));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category updateImg'))
    );
  }

  deleteById(id: number) {
    this.workingService.push('category deleteById');
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/category/delete/${id}`).pipe(
      tap(() => {
        this.categories.update(cats => cats.filter(cat => cat.id !== id));
        if(this.categories().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay categorias.',
            detail: 'No se encontraron categorias.'
          };
          this.categoriesError.update(() => error)
        }
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        if (error.error.error.code === 404) {
          console.error("Id no encontrado para eliminar categoria.", error);
        }
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category deleteById'))
    )
  }

  // CATEGORY HAS PAYMENT TYPE
  createCategoryHasPaymentType(hasPaymentType: CategoryHasPaymentType): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type create');
    return this.http.post<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type`, hasPaymentType).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(hasPaymentType.id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type create'))
    )
  }
  
  updateCategoryHasPaymentType(hasPaymentType: CategoryHasPaymentType): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type update');
    return this.http.put<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type`, hasPaymentType).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(hasPaymentType.id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type update'))
    )
  }

  changeStateCategoryHasPaymentType(id: CategoryHasPaymentTypeId): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type changeState');
    return this.http.put<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type/state`, id).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type changeState'))
    )
  }
}
