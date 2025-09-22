import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../utils/session/session.service';
import { Category } from '@models/data/category.model';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';
import { S3File } from '@models/utils/file.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  products = signal<Product[]>([]);
  productImagesFinded = signal<number[]>([]);
  productsError = signal<ErrorMessage | null>(null);

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  accountId = this.session()?.userId ?? -1;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {
    this.products.set([]);
    this.productsError.set(null);
    this.productImagesFinded.set([]);
    this.validateRole();
  }
  
  validateRole() {
    effect(() => {
      if(!this.session() || this.session()?.role === '') return;
      if(this.session()?.role === 'admin') this.findByAccount();
    }, {injector: this.injector, allowSignalWrites: true})
  }

  private findByAccount() {
    this.loadingService.push('product findByAccount');
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${this.accountId}?allImages=false`)
    .pipe(
      map(response => response.data),
      tap(products => {
        this.products.update(() => products);
        this.productsError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.productsError.update(() => error.error.error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('product findByAccount'))
    ).subscribe();
  }

  findById(id: number): Observable<Product> {
    this.workingService.push(`product findById ${id}`);
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/product/${id}?allImages=true`).pipe(
      map(response => response.data),
      tap(product => {
        this.products.update(products => {
          const index = products.findIndex(prod => prod.id === id);
          if (index === -1) {
            return [...products, product];
          } else {
            return products.map(prod => prod.id === id ? product : prod);
          }
        });
      }),
      finalize(() => this.workingService.drop(`product findById ${id}`))
    )
  }

  findByCategoryId(category: Category) {
    this.loadingService.push('product findByCategoryId');
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/category/${category.id}?allImages=false`).pipe(
      map(response => response.data),
      tap(products => {
        this.products.update(() => products);
      }),
      finalize(() => this.loadingService.drop('product findByCategoryId'))
    ).subscribe()
  }

  getById(id: number): Signal<Product | undefined> {
    return computed(() => this.products().find(prod => prod.id === id));
  }
  
  create(product: Product): Observable<Product> {
    this.workingService.push('product create');

    const userId = this.session()?.userId ?? -1;

    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(newProduct => {
        this.products.update(products => [...products, newProduct]);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product create'))
    );
  }
  
  update(product: Product): Observable<Product> {
    this.workingService.push('product update');

    const userId = this.session()?.userId ?? -1;
    
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(updatedProduct => {
        this.products.update(products => products.map(prod => prod.id === updatedProduct.id ? updatedProduct : prod));
      }),
      catchError((error) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product update'))
    );
  }
  
  deleteById(id: number) {
    const product = this.products().find(prod => prod.id === id);
    if (!product) return of();
    
    this.workingService.push('product deleteById');

    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/product/delete/${id}`).pipe(
      tap(() => {
        this.products.update(products => products.filter(prod => prod.id !== id));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        if (error.error.error.code === 404) {
          console.error("Id no encontrado para eliminar producto.", error);
        }
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product deleteById'))
    );
  }

  deleteProductFiles(productId: number, files: S3File[]): Observable<Product> {
    this.workingService.push('product deleteProductFiles');

    const userId = this.session()?.userId ?? -1;

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product/${productId}/delete-images`, files, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(updatedProduct => {
        this.products.update(products => products.map(prod => prod.id === updatedProduct.id ? updatedProduct : prod));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product deleteProductFiles'))
    );
  }

  uploadProductFiles(productId: number, files: S3File[]): Observable<Product> {
    this.workingService.push('product uploadProductFiles');

    const userId = this.session()?.userId ?? -1;

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product/${productId}/upload-images`, files, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(updatedProduct => {
        this.products.update(products => products.map(prod => prod.id === updatedProduct.id ? updatedProduct : prod));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product uploadProductFiles'))
    );
  }

}
