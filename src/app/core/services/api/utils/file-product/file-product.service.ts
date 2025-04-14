import { computed, Injectable, Signal } from '@angular/core';
import { FileService } from '../file/file.service';
import { S3File } from '@models/utils/file.model';
import { concat, forkJoin, map, Observable, of } from 'rxjs';
import { Product } from '@models/data/product.model';
import { ApiResponse } from '@models/data/general.model';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';
import { SessionData } from '@models/security/security-data.model';

@Injectable({
  providedIn: 'root'
})
export class FileProductService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  constructor(
    private http: HttpClient, 
    private sessionService: SessionService, 
    private fileService: FileService
  ) { }

  findAllFirstImage(products: Product[], accountId?: number): Observable<S3File[]> {
    const validProducts = products.filter(p => p.imageNumber > 0 && p.imageName && p.imageName !== environment.DEFAULT_IMAGE_PRODUCT_NAME);

    if (validProducts.length === 0) return of([]);

    const requests = validProducts.map(product => this.getImageRequest(product, accountId));
    return forkJoin(requests);
  }

  private getImageRequest(product: Product, accountId?: number): Observable<S3File> {
    const firstImageName = product.imageName.split(",")[0];
    const file = new S3File();
    file.name = firstImageName;
    file.context = "product";
    file.accountId = accountId ?? this.session()?.accountId ?? -1;
    return this.fileService.getFile(file);
  }

  findImage(product: Product, accountId?: number): Observable<S3File[]> {
    const requests = this.getImagesRequest(product, accountId);
  
    return forkJoin(requests);
  }

  private getImagesRequest(product: Product, accountId?: number): Observable<S3File>[] {
    if (product.imageNumber == 0 || !product.imageName || product.imageName == environment.DEFAULT_IMAGE_PRODUCT_NAME) return [];

    return product.imageName.split(",").map(imageName => {
      return this.fileService.getFile({ name: imageName, context: "product", accountId: accountId ?? this.session()?.accountId ?? -1 } as S3File);
    });
  }

  uploadFiles(files: S3File[], productId: number): Observable<void> {
    if (files.length === 0) return of(undefined);
    files = files.map(file => { return {...file, context: 'product' } })
    return concat(
      ...files.map(file => this.putProductFile(file, productId))
    ).pipe(
      map(() => undefined)
    );
  }

  private putProductFile(file: S3File, productId: number): Observable<Product> {
    file.accountId = this.session()?.accountId ?? -1;
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/s3/product/put/${productId}`, file)
      .pipe(
        map(response => response.data)
      );
  }

  deleteFiles(files: S3File[], productId: number): Observable<void> {
    if (files.length === 0) return of(undefined);
    files = files.map(file => { return {...file, context: 'product' } })
    return concat(
      ...files.map(file => this.deleteProductFile(file, productId))
    ).pipe(
      map(() => undefined)
    );
  }

  private deleteProductFile(file: S3File, productId: number): Observable<Product> {
    file.accountId = this.session()?.accountId ?? -1;
    file.content = '';
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/s3/product/delete/${productId}/account/${file.accountId}`, file)
      .pipe(
        map(response => response.data)
      );
  }

}
