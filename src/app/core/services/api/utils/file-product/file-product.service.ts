import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { S3File } from '@models/utils/file.model';
import { concat, forkJoin, map, Observable, of } from 'rxjs';
import { Product } from '@models/data/product.model';
import { ApiResponse } from '@models/data/general.model';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileProductService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  accountId: number = this.sessionService.getAccountId();

  constructor(
    private http: HttpClient, 
    private sessionService: SessionService, 
    private fileService: FileService
  ) { }

  findAllFirstImage(products: Product[], accountId?: number): Observable<S3File[]> {
    const validProducts = products.filter(p => p.imageNumber > 0 && p.imageName && p.imageName !== 'product.png');

    if (validProducts.length === 0) return of([]);

    const requests = validProducts.map(product => this.getImageRequest(product, accountId));
    return forkJoin(requests);
  }

  private getImageRequest(product: Product, accountId?: number): Observable<S3File> {
    const firstImageName = product.imageName.split(",")[0];
    const file = new S3File();
    file.name = firstImageName;
    file.context = "product";
    file.accountId = accountId ?? this.accountId;
    return this.fileService.getFile(file);
  }

  findImage(product: Product, accountId?: number): Observable<S3File[]> {
    const requests = this.getImagesRequest(product, accountId);
  
    return forkJoin(requests);
  }

  private getImagesRequest(product: Product, accountId?: number): Observable<S3File>[] {
    if (product.imageNumber == 0 || !product.imageName || product.imageName == 'product.png') return [];

    return product.imageName.split(",").map(imageName => {
      return this.fileService.getFile({ name: imageName, context: "product", accountId: accountId ?? this.accountId } as S3File);
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
    file.accountId = this.accountId;
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
    file.accountId = this.accountId;
    file.content = '';
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/s3/product/delete/${productId}/account/${file.accountId}`, file)
      .pipe(
        map(response => response.data)
      );
  }

}
