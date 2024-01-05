import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { ApiResponse } from 'src/app/core/models/data-types/data/general.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = '';

  private categories: Category[] = [];
  private categoriesSubject = new BehaviorSubject<Category[]>(this.categories);
  storedCategories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  
  constructor(private http: HttpClient) {
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

}
