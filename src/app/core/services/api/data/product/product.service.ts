import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@models/data/general.model';
import { Product } from '@models/data/product.model';
import { BehaviorSubject, map, Observable, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../session/session.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { Subcategory } from '@models/data/subcategory.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl: string = '';

  private products: Product[] = [];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);
  storedProducts$ = this.productsSubject.asObservable();

  private subcategorySubscription: Subscription;
  private subcategories: Subcategory[] = [];

  constructor(
    private http: HttpClient,
    private sessionService: SessionService,
    private subcategoryService: SubcategoryService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.openSubscription();
    this.findAllByAccount();
  }

  openSubscription() {
    this.subcategorySubscription = this.subcategoryService.storedSubcategories$.subscribe({
      next: (subcategories) => {
        this.subcategories = subcategories;
      },
      error: (error) => {
        console.log("Ha ocurrido un error en subcategorias.", error);
      }
    })
  }

  private findAllByAccount() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/product/account/${accountId}`).subscribe({
      next: (products) => {
        this.products = products.data;
        this.productsSubject.next(this.products);
      },
      error: (error) => {
        console.log("error finding products: ", error);
      }
    })
  }

  getAll() {
    return this.storedProducts$.pipe();
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

  getBySubcategoryId(subcategoryId: number) {
    return this.storedProducts$
      .pipe(
        map(products => products.filter(prod => prod.subcategoryId == subcategoryId))
      );
  }

  getById(id: number) {
    return this.storedProducts$
      .pipe(
        map(products => products.find(product => product.id == id))
      );
  }

  getLikeName(name: string) {
    return this.storedProducts$
      .pipe(
        map(products => products.filter(product => product.name.toLowerCase().includes(name.toLowerCase())))
      );
  }

  getBetweenPrice(min: number, max: number) {
    return this.storedProducts$
      .pipe(
        map(products => products.filter(product => product.price >= min && product.price <= max))
      );
  }
  
  create(product: Product): Observable<ApiResponse<Product>> {
    const userId = this.sessionService.getUserId();
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        this.products.push(response.data);
        this.productsSubject.next(this.products);
      })
    )
  }
  
  update(product: Product): Observable<ApiResponse<Product>> {
    const userId = this.sessionService.getUserId();
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/product`, product, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        const index = this.products.findIndex(prod => prod.id == product?.id);
        this.products[index] = response.data;
        this.productsSubject.next(this.products);
      })
    )
  }
  
  deleteById(id: number) {
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/product/delete/${id}`).subscribe({
      next: (response) => {
        this.productsSubject.next(this.products.filter(prod => prod.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar producto.", error);
      }
    })
  }

}
