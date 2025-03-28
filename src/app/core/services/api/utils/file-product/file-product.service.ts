import { Injectable } from '@angular/core';
import { FileService } from '../file/file.service';
import { S3File } from '@models/utils/file.model';
import { concat, forkJoin, map, Observable, of } from 'rxjs';
import { Product } from '@models/data/product.model';
import { ApiResponse } from '@models/data/general.model';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../../session/session.service';
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

  findAllImages(products: Product[], accountId?: number) {
    const requests = products.map(product => this.getImageRequests(product, accountId));
  
    return forkJoin(requests.flat());
  }

  findImage(product: Product, accountId?: number) {
    const requests = this.getImageRequests(product, accountId);
  
    return forkJoin(requests);
  }

  private getImageRequests(product: Product, accountId?: number) {
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
