import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subcategory } from '@models/data/subcategory.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  apiUrl: string = '';

  private subcategories: Subcategory[] = [];
  private subcategoriesSubject = new BehaviorSubject<Subcategory[]>(this.subcategories);
  storedSubcategories$: Observable<Subcategory[]> = this.subcategoriesSubject.asObservable();
  
  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAll();
  }

  private findAll() {
    this.http.get<ApiResponse<Subcategory[]>>(`${this.apiUrl}/subcategory`).subscribe({
      next: (apiResponse) => {
        this.subcategories = apiResponse.data;
        this.subcategoriesSubject.next(this.subcategories);
      },
      error: (error) => {
        console.log("error finding subcategories: ", error);
      }
    })
  }

  getAll(): Observable<Subcategory[]> {
    return this.storedSubcategories$.pipe();
  }

  getByCategoryId(categoryId: number): Observable<Subcategory[]> {
    return this.storedSubcategories$.pipe(
      map(subcategories => subcategories.filter(sub => sub.categoryId == categoryId))
    );
  }

  getById(id: number): Observable<Subcategory | undefined> {
    return this.storedSubcategories$.pipe(
      map(subcategories => subcategories.find(sub => sub.id === id))
    );
  }

  create(subcategory: Subcategory): Observable<ApiResponse<Subcategory>> {
    const userId = this.sessionService.getUserId();
    return this.http.post<ApiResponse<Subcategory>>(`${this.apiUrl}/subcategory`, subcategory, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        this.subcategories.push(response.data);
        this.subcategoriesSubject.next(this.subcategories);
      })
    )
  }

  update(subcategory: Subcategory): Observable<ApiResponse<Subcategory>> {
    const userId = this.sessionService.getUserId();
    return this.http.put<ApiResponse<Subcategory>>(`${this.apiUrl}/subcategory`, subcategory, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        const index = this.subcategories.findIndex(sub => sub.id == subcategory?.id);
        this.subcategories[index] = response.data;
        this.subcategoriesSubject.next(this.subcategories);
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/subcategory/delete/${id}`).subscribe({
      next: (response) => {
        this.subcategoriesSubject.next(this.subcategories.filter(sub => sub.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar subcategoria.", error);
      }
    })
  }
  
}
