import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, find, map, Observable, tap } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { ApiResponse } from 'src/app/core/models/data-types/data/general.model';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = '';

  private categories: Category[] = [];
  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);
  storedCategories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  
  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAll();
  }

  private findAll() {
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category`).subscribe({
      next: (apiResponse) => {
        this.categories = apiResponse.data;
        this.categoriesSubject.next(this.categories);
      },
      error: (error) => {
        console.log("error finding categories: ", error);
      }
    })
  }

  getAll(): Observable<Category[]> {
    return this.storedCategories$.pipe();
  }

  getById(id: number): Observable<Category | undefined> {
    return this.storedCategories$.pipe(
      map(categories => categories.find(cat => cat.id === id))
    );
  }

  create(category: Category): Observable<ApiResponse<Category>> {
    const userId = this.sessionService.getUserId();
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        this.categories.push(response.data);
        this.categoriesSubject.next(this.categories);
      })
    )
  }

  update(category: Category): Observable<ApiResponse<Category>> {
    const userId = this.sessionService.getUserId();
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        const index = this.categories.findIndex(cat => cat.id == category?.id);
        this.categories[index] = response.data;
        this.categoriesSubject.next(this.categories);
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/category/delete/${id}`).subscribe({
      next: (response) => {
        this.categoriesSubject.next(this.categories.filter(cat => cat.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar categoria.", error);
      }
    })
  }

}
