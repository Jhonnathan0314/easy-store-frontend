import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { Category } from 'src/app/core/models/data-types/data/category.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/data-types/data/general.model';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../session/session.service';
import { FileService } from '../../utils/file/file.service';
import { S3File } from '@models/utils/file.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  categories = signal<Category[]>([]);
  categoriesError = signal<ErrorMessage | null>(null);

  role: Signal<string> = computed(() => this.sessionService.role());
  
  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private sessionService: SessionService,
    private fileService: FileService
  ) {
    this.categories.set([]);
    this.categoriesError.set(null);
    this.validateRole();
  }

  validateRole() {
    effect(() => {
      if (this.role() === '') return;
      if (this.role() === 'admin') {
        this.findAllByAccount();
      }else if (this.role() === 'client' || this.role() === 'ghost') {
        this.findAll();
      }
    }, {injector: this.injector})
  }

  private findAllByAccount() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category/account/${accountId}`).pipe(
      map(response => response.data),
      tap(categories => {
        this.categories.update(() => categories);
        this.categoriesError.update(() => null);
        this.findImages();
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.categoriesError.update(() => error.error.error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  private findAll() {
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category`).pipe(
      map(response => response.data),
      tap(categories => {
        this.categories.update(() => categories);
        this.categoriesError.update(() => null);
        this.findImages();
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.categoriesError.update(() => error.error.error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  private findImages() {
    const requests = this.getRequestObject();
  
    forkJoin(requests).subscribe({
      next: (responses) => {
        this.categories.update(categories => {
          return categories.map((cat, i) => ({
            ...cat,
            image: responses[i] ?? null
          }));
        });
      },
      error: (error) => {
        console.error("Error al cargar imágenes", error);
      }
    });
  }

  private getRequestObject() {
    return this.categories().map(category => {
      if (category.imageName !== 'store.png') {
        const file: S3File = new S3File();
        file.context = "category";
        file.name = category.imageName;
        file.accountId = category.accountId;
        return this.fileService.getFile(file);
      } else {
        return of(null);
      }
    });
  }

  getById(id: number): Signal<Category | undefined> {
    return computed(() => this.categories().find(cat => cat.id === id));
  }

  create(category: Category, file: S3File | null): Observable<Category> {
    const userId = this.sessionService.getUserId();
    const accountId = this.sessionService.getAccountId();
    category.userId = userId;
    category.accountId = accountId;

    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(categoryCreated => {
        if(file != null) {
          const imgName = `${categoryCreated.id}.png`
          file.context = 'category';
          file.name = imgName;
          categoryCreated.imageName = imgName;
          categoryCreated.image = file;
          this.uploadFile(file);
        }
        return categoryCreated;
      }),
      tap(categoryCreated => {
        this.categories.update(cats => [...cats, categoryCreated]);
        return categoryCreated;
      }),
      tap(categoryCreated => {
        if(file != null) {
          this.update(categoryCreated, null).subscribe();
        }
        return categoryCreated;
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      })
    )
  }

  update(category: Category, file: S3File | null): Observable<Category> {
    const userId = this.sessionService.getUserId();
    const accountId = this.sessionService.getAccountId();
    category.userId = userId;
    category.accountId = accountId;
    if(file != null && category.imageName == 'store.png') {
      category.imageName = `${category.id}.png`;
    }
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Update-By': `${userId}`
      }
    }).pipe(
      map(response => response.data),
      tap(categoryUpdated => {
        if(file != null) {
          const imgName = `${categoryUpdated.id}.png`
          file.context = 'category';
          file.name = imgName;
          categoryUpdated.imageName = imgName;
          categoryUpdated.image = file;
          this.uploadFile(file);
        }
        return categoryUpdated;
      }),
      tap(categoryUpdated => {
        this.categories.update(cats => cats.map(cat => cat.id === category.id 
          ? { ...categoryUpdated, image: file ?? cat.image } 
          : cat
        ));
        return categoryUpdated;
      }),
      catchError((error) => {
        if (error.error.error.code == 406 && file != null) {
          const imgName = `${category.id}.png`
          file.context = 'category';
          file.name = imgName;
          category.image = file;
          this.uploadFile(file);
          
          this.categories.update(cats => cats.map(cat => cat.id === category.id 
            ? { ...category, image: file }
            : cat
          ));
        }
        return throwError(() => error.error);
      })
    )
  }

  private uploadFile(file: S3File) {
    this.fileService.putFile(file).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error al cargar el archivo ", {name: file.name, error});
      }
    })
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/category/delete/${id}`)
    .pipe(
      tap(() => {
        const category = this.categories().find(cat => cat.id === id);
        const image = category?.image;
        if (image) {
          image.context = 'category';
          this.deleteFile(image);
        }
      }),
      tap(() => {
        this.categories.update(cats => cats.filter(cat => cat.id !== id));
        if(this.categories().length == 0) {
          const error: ErrorMessage = {
            code: 404,
            title: 'No hay categorias.',
            detail: 'No se encontraron categorias.'
          };
          this.categoriesError.update(() => error)
        }
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        if (error.error.error.code === 404) {
          console.error("Id no encontrado para eliminar categoria.", error);
        }
        return throwError(() => error);
      })
    ).subscribe()
  }

  private deleteFile(file: S3File) {
    this.fileService.deleteFile(file).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error al eliminar el archivo ", {name: file.name, error});
      }
    })
  }

}
