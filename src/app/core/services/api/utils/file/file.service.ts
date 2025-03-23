import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { S3File } from '@models/utils/file.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  accountId: number;

  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) { }

  getFile(file: S3File): Observable<S3File> {
    return this.http.get<ApiResponse<S3File>>(`${this.apiUrl}/s3/get/accountId/${file.accountId}/context/${file.context}/objectName/${file.name}`)
      .pipe(
        map(response => response.data)
      );
  }

  putFile(file: S3File): Observable<boolean> {
    file.accountId = this.sessionService.getAccountId();
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/s3/put`, file)
      .pipe(
        map(response => response.data)
      );
  }

  deleteFile(file: S3File): Observable<boolean> {
    file.accountId = this.sessionService.getAccountId();
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/s3/delete/accountId/${file.accountId}/context/${file.context}/objectName/${file.name}`)
      .pipe(
        map(response => response.data)
      );
  }

}
