import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { catchError, concat, concatMap, last, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../session/session.service';
import { S3File } from '@models/utils/file.model';
import { FileProductService } from '../../utils/file-product/file-product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  products = signal<Product[]>([]);
  productsError = signal<ErrorMessage | null>(null);

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private fileProductService: FileProductService
  ) {
    this.findByAccount();
  }

  findByAccount() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${accountId}`)
    .pipe(
      map(response => response.data),
      concatMap(products => {
        this.products.set(products.map(prod => ({...prod, images: []})));
        return this.findAllImages();
      }),
      catchError((error: ApiResponse<ErrorMessage>) => {
        this.productsError.set(error.error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  private findAllImages(): Observable<S3File[]> {
    return this.fileProductService.findAllImages(this.products()).pipe(
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
      })
    )
  }

  findProductImages(productId: number): Observable<S3File[]> {
    return this.fileProductService.findImage(this.products().find(prod => prod.id == productId) ?? new Product()).pipe(
      tap(responses => {
        this.products.update(products => {
          return products.map(prod => {
            if (prod.id === productId) {
              return {
                ...prod,
                images: [...responses]
              };
            }
            return prod;
          });
        });
      })
    )
  }

  findById(id: number): Observable<Product> {
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
      })
    )
  }

  getById(id: number): Signal<Product | undefined> {
    return computed(() => this.products().find(prod => prod.id = id));
  }
  
  create(product: Product, files: S3File[]): Observable<Product> {
    const userId = this.sessionService.getUserId();

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
      catchError((error: ApiResponse<ErrorMessage>) => {
        return throwError(() => error.error);
      })
    );
  }
  
  update(product: Product, filesToUpload: S3File[], filesToDelete: S3File[]): Observable<Product> {
    const userId = this.sessionService.getUserId();
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: { 'Update-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      concatMap(updatedProduct => {
        return this.fileProductService.uploadFiles(filesToUpload, updatedProduct.id).pipe(
          map(() => updatedProduct)
        )
      }),
      last(),
      concatMap(updatedProduct => {
        return this.fileProductService.deleteFiles(filesToDelete, updatedProduct.id).pipe(
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
            this.fileProductService.uploadFiles(filesToUpload, product.id),
            this.fileProductService.deleteFiles(filesToDelete, product.id),
            this.findById(product.id)
          ).pipe(
            map(() => product)
          );
        }
        return throwError(() => error.error);
      })
    );
  }
  
  deleteById(id: number) {
    const product = this.products().find(prod => prod.id === id);
    if (!product) return;

    this.fileProductService.deleteFiles(product.images, id).pipe(
      last(),
      concatMap(() => this.http.delete<ApiResponse<object>>(`${this.apiUrl}/product/delete/${id}`)),
      tap(() => {
        this.products.update(() => this.products().filter(prod => prod.id !== id));
      }),
      catchError(() => {
        return of(null);
      })
    ).subscribe();
  }

}
