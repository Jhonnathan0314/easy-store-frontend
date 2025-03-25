import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { Subcategory } from '@models/data/subcategory.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  apiUrl: string = '';

  subcategories = signal<Subcategory[]>([]);
  subcategoriesError = signal<ErrorMessage | null>(null);

  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAllByAccountId();
  }

  private findAllByAccountId() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Subcategory[]>>(`${this.apiUrl}/subcategory/account/${accountId}`).pipe(
      map(response => response.data),
      tap(subcategories => {
        this.subcategories.set(subcategories);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.subcategoriesError.set(error.error.error);
        return throwError(() => error);
      })
    ).subscribe()
  }

  getById(id: number): Signal<Subcategory | undefined> {
    return computed(() => this.subcategories().find(subcat => subcat.id === id));
  }

  create(subcategory: Subcategory): Observable<Subcategory> {
    const userId = this.sessionService.getUserId();
    return this.http.post<ApiResponse<Subcategory>>(`${this.apiUrl}/subcategory`, subcategory, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(sucategoryCreated => {
        this.subcategories.update(subcats => [...subcats, sucategoryCreated]);
      })
    )
  }

  update(subcategory: Subcategory): Observable<Subcategory> {
    const userId = this.sessionService.getUserId();
    return this.http.put<ApiResponse<Subcategory>>(`${this.apiUrl}/subcategory`, subcategory, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(subcategoryUpdated => {
        this.subcategories.update(subcats => subcats.map(subcat => subcat.id === subcategory.id 
          ? subcategoryUpdated 
          : subcat
        ));
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/subcategory/delete/${id}`).pipe(
      tap(() => {
        this.subcategories.update(subcats => subcats.filter(subcat => subcat.id != id));
      })
    ).subscribe()
  }
  
}
