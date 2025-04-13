import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { Subcategory } from '@models/data/subcategory.model';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  subcategories = signal<Subcategory[]>([]);
  subcategoriesError = signal<ErrorMessage | null>(null);

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {
    this.subcategories.set([]);
    this.subcategoriesError.set(null);
    this.validateRole();
  }

  validateRole() {
    effect(() => {
      if(!this.session() || this.session()?.role === '') return;
      this.findAllByAccountId();
    }, {injector: this.injector, allowSignalWrites: true})
  }

  private findAllByAccountId() {
    this.loadingService.push('subcategory findAllByAccountId');
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Subcategory[]>>(`${this.apiUrl}/subcategory/account/${accountId}`).pipe(
      map(response => response.data),
      tap(subcategories => {
        this.subcategories.update(() => subcategories);
        this.subcategoriesError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.subcategoriesError.update(() => error.error.error);
        this.subcategories.update(() => []);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('subcategory findAllByAccountId'))
    ).subscribe()
  }

  getById(id: number): Signal<Subcategory | undefined> {
    return computed(() => this.subcategories().find(subcat => subcat.id === id));
  }

  create(subcategory: Subcategory): Observable<Subcategory> {
    this.workingService.push('subcategory create');

    const userId = this.sessionService.getUserId();

    return this.http.post<ApiResponse<Subcategory>>(`${this.apiUrl}/subcategory`, subcategory, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(subcategoryCreated => {
        this.subcategories.update(subcats => [...subcats, subcategoryCreated]);
      }),
      finalize(() => this.workingService.drop('subcategory create'))
    )
  }

  update(subcategory: Subcategory): Observable<Subcategory> {
    this.workingService.push('subcategory update');

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
      }),
      finalize(() => this.workingService.drop('subcategory update'))
    )
  }

  deleteById(id: number) {
    this.workingService.push('subcategory deleteById');
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/subcategory/delete/${id}`).pipe(
      tap(() => {
        this.subcategories.update(subcats => subcats.filter(subcat => subcat.id != id));
        if(this.subcategories().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay subcategorias.',
            detail: 'No se encontraron subcategorias.'
          };
          this.subcategoriesError.update(() => error)
        }
      }),
      finalize(() => this.workingService.drop('subcategory deleteById'))
    ).subscribe()
  }
  
}
