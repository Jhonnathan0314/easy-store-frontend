import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, ReplaySubject, tap, throwError } from 'rxjs';
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

  apiUrl: string = '';

  private categories: Category[] = [];
  private categoriesSubject = new ReplaySubject<Category[]>(1);
  storedCategories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService,
    private fileService: FileService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAllByAccount();
  }

  findAllByAccount() {
    const accountId = this.sessionService.getAccountId();
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/category/account/${accountId}`).pipe(
      map(response => response.data),
      tap(categories => {
        this.categories = categories;
        this.findImages();
      }),
      catchError((error: ApiResponse<ErrorMessage>) => throwError(() => error))
    ).subscribe({
      error: (error: ApiResponse<ErrorMessage>) => {
        this.categoriesSubject.error(error);
      }
    });
  }

  private findImages() {
    const requests = this.getRequestObject();
  
    forkJoin(requests).subscribe({
      next: (responses) => {
        responses.forEach((response, index) => {
          if (response) {
            this.categories[index].image = response;
          }
        });
        this.categoriesSubject.next(this.categories);
      },
      error: (error) => {
        console.error("Error al cargar imágenes", error);
      }
    });
  }

  private getRequestObject() {
    return this.categories.map(category => {
      if (category.imageName != 'store.png') {
        const file = new S3File();
        file.context = "category";
        file.name = category.imageName;
        return this.fileService.getFile(file);
      } else {
        return of(null);
      }
    });
  }

  getAll(): Observable<Category[]> {
    return this.storedCategories$.pipe();
  }

  getById(id: number): Observable<Category | undefined> {
    return this.storedCategories$.pipe(
      map(categories => categories.find(cat => cat.id === id))
    );
  }

  create(category: Category, file: S3File | null): Observable<ApiResponse<Category>> {
    const userId = this.sessionService.getUserId();
    const accountId = this.sessionService.getAccountId();
    category.userId = userId;
    category.accountId = accountId;
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/category`, category, {
      headers: {
        'Create-By': `${userId}`
      }
    }).pipe(
      tap(response => {
        if(file != null) {
          const imgName = `${response.data.id}.png`
          file.context = 'category';
          file.name = imgName;
          response.data.imageName = imgName;
          response.data.image = file;
          this.uploadFile(file);
        }
        return response;
      }),
      tap(response => {
        this.categories.push(response.data);
        this.categoriesSubject.next(this.categories);
        return response;
      }),
      tap(response => {
        if(file != null) {
          this.update(response.data, null).subscribe();
        }
        return response;
      })
    )
  }

  update(category: Category, file: S3File | null): Observable<ApiResponse<Category>> {
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
      tap(response => {
        if(file != null) {
          const imgName = `${response.data.id}.png`
          file.context = 'category';
          file.name = imgName;
          response.data.imageName = imgName;
          response.data.image = file;
          this.uploadFile(file);
        }
        return response;
      }),
      tap(response => {
        const index = this.categories.findIndex(cat => cat.id == category?.id);
        this.categories[index] = {
          ...response.data,
          image: this.categories[index].image ? this.categories[index].image : file
        };
        this.categoriesSubject.next(this.categories);
        return response;
      }),
      catchError((error) => {
        if (error.error.error.code == 406 && file != null) {
          const imgName = `${category.id}.png`
          file.context = 'category';
          file.name = imgName;
          category.image = file;
          this.uploadFile(file);
          
          const index = this.categories.findIndex(cat => cat.id == category?.id);
          this.categories[index] = {
            ...category,
            image: file
          };
          this.categoriesSubject.next(this.categories);
        }
        const response: ApiResponse<Category> = new ApiResponse();
        response.data = category;
        return of(response);
      })
    )
  }

  private uploadFile(file: S3File) {
    this.fileService.putFile(file).subscribe({
      next: () => { },
      error: (error) => {
        console.log("Ha ocurrido un error al cargar el archivo ", {name: file.name, error});
      }
    })
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/category/delete/${id}`)
    .pipe(
      tap(response => {
        const index = this.categories.findIndex(cat => cat.id == id);
        const category = this.categories[index];
        const image = category.image;
        if(image){
          image.context = 'category';
          this.deleteFile(image);
        }
        return response;
      }),
      tap(response => {
        this.categories = this.categories.filter(cat => cat.id != id);
        this.categoriesSubject.next(this.categories);
        return response;
      })
    )
    .subscribe({
      next: () => { },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar categoria.", error);
      }
    })
  }

  private deleteFile(file: S3File) {
    this.fileService.deleteFile(file).subscribe({
      next: () => { },
      error: (error) => {
        console.log("Ha ocurrido un error al eliminar el archivo ", {name: file.name, error});
      }
    })
  }

}
