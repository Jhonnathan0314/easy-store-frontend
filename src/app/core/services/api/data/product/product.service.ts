import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { catchError, concat, concatMap, last, map, Observable, of, ReplaySubject, Subject, takeUntil, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../session/session.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { Subcategory } from '@models/data/subcategory.model';
import { S3File } from '@models/utils/file.model';
import { FileProductService } from '../../utils/file-product/file-product.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnDestroy {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  private products: Product[] = [];
  private productsSubject = new ReplaySubject<Product[]>(1);
  storedProducts$ = this.productsSubject.asObservable();

  private subcategories: Subcategory[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private subcategoryService: SubcategoryService,
    private fileProductService: FileProductService
  ) {
    this.subscribeToSubcategories();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subscribeToSubcategories() {
    this.subcategoryService.storedSubcategories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(subcategories => this.subcategories = subcategories);
  }

  findByAccount() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${accountId}`)
    .pipe(
      map(response => response.data),
      concatMap(products => {
        this.products = products.map(prod => ({...prod, images: []}));
        this.productsSubject.next(this.products);
        return this.findAllImages();
      }),
      catchError((error: ApiResponse<ErrorMessage>) => {
        if(error.error.code == 404) return throwError(() => error);
        return of(null);
      })
    ).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.productsSubject.error(error);
      }
    });
  }

  private findAllImages(): Observable<S3File[]> {
    return this.fileProductService.findAllImages(this.products).pipe(
      tap(responses => {
        responses.forEach(response => {
          const productId = parseInt(response.name.split('-')[0]);
          const product = this.products.find(prod => prod.id == productId);
          if (product) product.images.push(response);
        });
        this.productsSubject.next(this.products);
      })
    )
  }

  findProductImages(productId: number): Observable<S3File[]> {
    return this.fileProductService.findImage(this.products.find(prod => prod.id == productId) ?? new Product()).pipe(
      tap(responses => {
        const files: S3File[] = [];
        responses.forEach(response => {
          files.push(response);
        });
        const productIndex = this.products.findIndex(prod => prod.id == productId);
        this.products[productIndex].images = files;
        this.productsSubject.next(this.products);
      })
    )
  }

  findById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/product/${id}`).pipe(
      map(response => response.data),
      tap(product => {
        const index = this.products.findIndex(prod => prod.id == id);
        if(index == -1) this.products.push(product);
        else this.products[index] = product;
        this.productsSubject.next(this.products);
      })
    )
  }

  getById(id: number) {
    return this.storedProducts$
      .pipe(
        map(products => products.find(product => product.id == id))
      );
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
      catchError(() => {
        return concat(
          this.fileProductService.uploadFiles(filesToUpload, product.id),
          this.fileProductService.deleteFiles(filesToDelete, product.id),
          this.findById(product.id)
        ).pipe(
          map(() => product)
        );
      })
    );
  }
  
  deleteById(id: number) {
    const product = this.products.find(prod => prod.id === id);
    if (!product) return;

    this.fileProductService.deleteFiles(product.images, id).pipe(
      last(),
      concatMap(() => this.http.delete<ApiResponse<object>>(`${this.apiUrl}/product/delete/${id}`)),
      tap(() => {
        this.products = this.products.filter(prod => prod.id !== id);
        this.productsSubject.next(this.products);
      }),
      catchError(() => {
        return of(null);
      })
    ).subscribe();
  }

}
