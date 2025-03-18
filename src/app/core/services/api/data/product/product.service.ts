import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ApiResponse } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { BehaviorSubject, catchError, concat, concatMap, last, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
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
    this.findByAccount().subscribe();
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

  private findByAccount(): Observable<S3File[]> {
    const accountId = this.sessionService.getAccountId();
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${accountId}`)
    .pipe(
      map(response => response.data),
      concatMap(products => {
        this.products = products.map(prod => ({...prod, images: []}));
        this.productsSubject.next(this.products);
        return this.findAllImages();
      })
    )
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
        let files: S3File[] = [];
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

  getByCategoryId(categoryId: number) {
    return this.storedProducts$
      .pipe(
        map(products => products.filter(prod => {
          const subcategory = this.subcategories.find(sub => sub.id == prod.subcategoryId);
          return subcategory?.categoryId == categoryId;
        }))
      );
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
      catchError(error => {
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
      concatMap(() => this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/product/delete/${id}`)),
      tap(() => {
        this.products = this.products.filter(prod => prod.id !== id);
        this.productsSubject.next(this.products);
      }),
      catchError(error => {
        return of(null);
      })
    ).subscribe();
  }

}
