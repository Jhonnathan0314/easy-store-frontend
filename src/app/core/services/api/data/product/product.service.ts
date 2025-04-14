import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { catchError, concat, concatMap, finalize, last, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../utils/session/session.service';
import { S3File } from '@models/utils/file.model';
import { FileProductService } from '../../utils/file-product/file-product.service';
import { Category } from '@models/data/category.model';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';

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
    private sessionService: SessionService,
    private fileProductService: FileProductService
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
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${this.accountId}`)
    .pipe(
      map(response => response.data),
      concatMap(products => {
        this.products.update(() => products.map(prod => ({...prod, images: []})));
        this.productsError.update(() => null);
        return this.findAllFirstImage();
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.productsError.update(() => error.error.error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('product findByAccount'))
    ).subscribe();
  }

  private findAllFirstImage(accountId?: number): Observable<S3File[]> {
    if (this.products().length === 0) return of([]);
    this.workingService.push('product findAllFirstImage');
    return this.fileProductService.findAllFirstImage(this.products(), accountId).pipe(
      tap(responses => {
        this.products.update(products => {
          return products.map(product => ({
            ...product,
            images: responses.filter(response => {
              const productId = parseInt(response.name.split('-')[0]);
              return productId === product.id;
            })
          }));
        });
      }),
      finalize(() => this.workingService.drop('product findAllFirstImage'))
    )
  }

  findProductImages(productId: number, accountId?: number): Observable<S3File[]> {
    this.workingService.push(`product findProductImages ${productId}`);
    return this.fileProductService.findImage(this.products().find(prod => prod.id == productId) ?? new Product(), accountId).pipe(
      tap(responses => {
        this.products.update(products => {
          return products.map(prod => {
            if (prod.id === productId) {
              return {
                ...prod,
                images: [...responses]
              };
            }
            this.productImagesFinded.update(ids => ids.includes(productId) ? ids : [...ids, productId]);
            return prod;
          });
        });
      }),
      finalize(() => this.workingService.drop(`product findProductImages ${productId}`))
    )
  }

  findById(id: number): Observable<Product> {
    this.workingService.push(`product findById ${id}`);
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/product/${id}`).pipe(
      map(response => response.data),
      tap(product => {
        this.products.update(products => {
          const index = products.findIndex(prod => prod.id === id);
          if (index === -1) {
            return [...products, { ...product, images: [] }];
          } else {
            return products.map(prod => prod.id === id ? { ...product, images: prod.images } : prod);
          }
        });
      }),
      finalize(() => this.workingService.drop(`product findById ${id}`))
    )
  }

  findByCategoryId(category: Category) {
    this.loadingService.push('product findByCategoryId');
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/category/${category.id}`).pipe(
      map(response => response.data),
      tap(products => {
        this.products.update(() => products.map(prod => ({...prod, images: []})));
      }),
      concatMap(() => {
        return this.findAllFirstImage(category.accountId);
      }),
      finalize(() => this.loadingService.drop('product findByCategoryId'))
    ).subscribe()
  }

  getById(id: number): Signal<Product | undefined> {
    return computed(() => this.products().find(prod => prod.id === id));
  }
  
  create(product: Product, files: S3File[]): Observable<Product> {
    this.workingService.push('product create');

    const userId = this.session()?.userId ?? -1;

    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      concatMap(createdProduct => {
        return this.fileProductService.uploadFiles(files, createdProduct.id).pipe(
          map(() => createdProduct)
        )
      }),
      last(),
      concatMap(createdProduct => {
        return this.findById(createdProduct.id);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product create'))
    );
  }
  
  update(product: Product, filesToUpload: S3File[], filesToDelete: S3File[]): Observable<Product> {
    this.workingService.push('product update');

    const userId = this.session()?.userId ?? -1;
    
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      concatMap(updatedProduct => {
        return this.fileProductService.deleteFiles(filesToDelete, updatedProduct.id).pipe(
          map(() => updatedProduct)
        )
      }),
      last(),
      concatMap(updatedProduct => {
        return this.fileProductService.uploadFiles(filesToUpload, updatedProduct.id).pipe(
          map(() => updatedProduct)
        )
      }),
      last(),
      concatMap(updatedProduct => {
        return this.findById(updatedProduct.id);
      }),
      catchError((error) => {
        if(error.error.error.code == 406 && (filesToUpload.length > 0 || filesToDelete.length > 0)) {
          return concat(
            this.fileProductService.deleteFiles(filesToDelete, product.id),
            this.fileProductService.uploadFiles(filesToUpload, product.id),
            this.findById(product.id)
          ).pipe(
            map(() => product)
          );
        }
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('product update'))
    );
  }
  
  deleteById(id: number) {
    const product = this.products().find(prod => prod.id === id);
    if (!product) return of();
    
    this.workingService.push('product deleteById');

    return this.fileProductService.deleteFiles(product.images, id).pipe(
      last(),
      concatMap(() => this.http.delete<ApiResponse<object>>(`${this.apiUrl}/product/delete/${id}`)),
      tap(() => {
        this.products.update(() => this.products().filter(prod => prod.id !== id));
        if(this.products().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay productos.',
            detail: 'No se encontraron productos.'
          };
          this.productsError.update(() => error)
        }
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

}
