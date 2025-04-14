import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, Injector, Signal, signal } from '@angular/core';
import { catchError, finalize, forkJoin, map, Observable, of, tap, throwError } from 'rxjs';
import { Category, CategoryHasPaymentType, CategoryHasPaymentTypeId } from 'src/app/core/models/data-types/data/category.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/data-types/data/general.model';
import { environment } from 'src/environments/environment';
import { SessionService } from '../../../utils/session/session.service';
import { FileService } from '../../utils/file/file.service';
import { S3File } from '@models/utils/file.model';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';
import { SessionData } from '@models/security/security-data.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  categories = signal<Category[]>([]);
  categoriesError = signal<ErrorMessage | null>(null);

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());
  
  constructor(
    private http: HttpClient, 
    private injector: Injector,
    private workingService: WorkingService,
    private loadingService: LoadingService,
    private sessionService: SessionService,
    private fileService: FileService
  ) {
    this.categories.set([]);
    this.categoriesError.set(null);
    this.validateRole();
  }

  validateRole() {
    effect(() => {
      if(!this.session() || this.session()?.role === '') return;
      if (this.session()?.role === 'admin') {
        this.findAllByAccount();
      }else if (this.session()?.role === 'client' || this.session()?.role === 'ghost') {
        this.findAll();
      }
    }, {injector: this.injector, allowSignalWrites: true})
  }

  private findAllByAccount() {
    this.loadingService.push('category findAllByAccount');
    const accountId = this.session()?.accountId ?? -1;
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
      }),
      finalize(() => this.loadingService.drop('category findAllByAccount'))
    ).subscribe();
  }

  private findAll() {
    this.loadingService.push('category findAll');
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
      }),
      finalize(() => this.loadingService.drop('category findAll'))
    ).subscribe();
  }

  private findImages() {
    this.workingService.push('category findImages');
    const requests = this.getRequestObject();
  
    forkJoin(requests).pipe(
      finalize(() => this.workingService.drop('category findImages'))
    ).subscribe({
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
      if (category.imageName !== environment.DEFAULT_IMAGE_CATEGORY_NAME) {
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
    this.workingService.push('category create');

    category.userId = this.session()?.userId ?? -1;
    category.accountId = this.session()?.userId ?? -1;

    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: { 'Create-By': `${category.userId}` }
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
      }),
      finalize(() => this.workingService.drop('category create'))
    )
  }

  update(category: Category, file: S3File | null): Observable<Category> {
    this.workingService.push('category update');

    category.userId = this.session()?.userId ?? -1;
    category.accountId = this.session()?.accountId ?? -1;

    if(file != null && category.imageName == environment.DEFAULT_IMAGE_CATEGORY_NAME) {
      category.imageName = `${category.id}.png`;
    }

    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Update-By': `${category.userId}`
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
      }),
      finalize(() => this.workingService.drop('category update'))
    )
  }

  private uploadFile(file: S3File) {
    this.workingService.push('category uploadFile');
    this.fileService.putFile(file).pipe(
      finalize(() => this.workingService.drop('category uploadFile'))
    ).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error al cargar el archivo ", {name: file.name, error});
      }
    })
  }

  deleteById(id: number) {
    this.workingService.push('category deleteById');
    return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/category/delete/${id}`).pipe(
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
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category deleteById'))
    )
  }

  private deleteFile(file: S3File) {
    this.workingService.push('category deleteFile');
    this.fileService.deleteFile(file).pipe(
      finalize(() => this.workingService.drop('category deleteFile'))
    ).subscribe({
      error: (error) => {
        console.log("Ha ocurrido un error al eliminar el archivo ", {name: file.name, error});
      }
    })
  }

  findById(id: number) {
    this.workingService.push(`category findById ${id}`);
    this.http.get<ApiResponse<Category>>(`${this.apiUrl}/category/${id}`).pipe(
      map(response => response.data),
      tap(category => {
        this.categories.update(categories => {
          const index = categories.findIndex(prod => prod.id === id);
          if (index === -1) {
            return [...categories, { ...category, images: [] }];
          } else {
            return categories.map(cat => cat.id === id ? { ...category, image: cat.image } : cat);
          }
        });
      }),
      finalize(() => this.workingService.drop(`category findById ${id}`))
    ).subscribe();
  }

  // CATEGORY HAS PAYMENT TYPE
  createCategoryHasPaymentType(hasPaymentType: CategoryHasPaymentType): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type create');
    return this.http.post<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type`, hasPaymentType).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(hasPaymentType.id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type create'))
    )
  }
  
  updateCategoryHasPaymentType(hasPaymentType: CategoryHasPaymentType): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type update');
    return this.http.put<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type`, hasPaymentType).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(hasPaymentType.id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type update'))
    )
  }

  changeStateCategoryHasPaymentType(id: CategoryHasPaymentTypeId): Observable<CategoryHasPaymentType> {
    this.workingService.push('category-has-payment-type changeState');
    return this.http.put<ApiResponse<CategoryHasPaymentType>>(`${this.apiUrl}/category-has-payment-type/state`, id).pipe(
      map(response => response.data),
      tap(() => {
        this.findById(id.categoryId);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('category-has-payment-type changeState'))
    )
  }
}
