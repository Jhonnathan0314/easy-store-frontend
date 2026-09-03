import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { StoreRequest, StoreRequestRq } from '@models/data/store-request.model';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { environment } from 'src/environments/environment';
import { WorkingService } from '../../../utils/working/working.service';
import { LoadingService } from '../../../utils/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class StoreRequestService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  storeRequests = signal<StoreRequest[]>([]);
  storeRequestsError = signal<ErrorMessage | null>(null);

  pendingStoreRequests = signal<StoreRequest[]>([]);
  pendingStoreRequestsError = signal<ErrorMessage | null>(null);

  constructor(
    private http: HttpClient,
    private workingService: WorkingService,
    private loadingService: LoadingService
  ) {
    this.storeRequests.set([]);
    this.storeRequestsError.set(null);
    this.pendingStoreRequests.set([]);
    this.pendingStoreRequestsError.set(null);
  }

  createRequest(storeName: string, storeDescription: string, userId: number): Observable<StoreRequest> {
    this.workingService.push('store-request createRequest');

    const body: StoreRequestRq = { storeName, storeDescription };

    return this.http.post<ApiResponse<StoreRequest>>(`${this.apiUrl}/store-request`, body, {
      headers: { 'Create-By': `${userId}` }
    }).pipe(
      map(response => response.data),
      tap(storeRequestCreated => {
        this.storeRequests.update(requests => [...requests, storeRequestCreated]);
        this.storeRequestsError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.storeRequestsError.update(() => error.error.error);
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('store-request createRequest'))
    );
  }

  findByUserId(userId: number): void {
    this.loadingService.push('store-request findByUserId');

    this.http.get<ApiResponse<StoreRequest[]>>(`${this.apiUrl}/store-request/user/${userId}`).pipe(
      map(response => response.data),
      tap(storeRequests => {
        this.storeRequests.update(() => storeRequests);
        this.storeRequestsError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.storeRequestsError.update(() => error.error.error);
        this.storeRequests.update(() => []);
        return throwError(() => error.error);
      }),
      finalize(() => this.loadingService.drop('store-request findByUserId'))
    ).subscribe();
  }

  findPending(): void {
    this.loadingService.push('store-request findPending');

    this.http.get<ApiResponse<StoreRequest[]>>(`${this.apiUrl}/store-request/pending`).pipe(
      map(response => response.data),
      tap(storeRequests => {
        this.pendingStoreRequests.update(() => storeRequests);
        this.pendingStoreRequestsError.update(() => null);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.pendingStoreRequestsError.update(() => error.error.error);
        this.pendingStoreRequests.update(() => []);
        return throwError(() => error.error);
      }),
      finalize(() => this.loadingService.drop('store-request findPending'))
    ).subscribe();
  }

  approve(id: number, adminId: number): Observable<StoreRequest> {
    this.workingService.push('store-request approve');

    return this.http.put<ApiResponse<StoreRequest>>(`${this.apiUrl}/store-request/${id}/approve`, {}, {
      headers: { 'Update-By': `${adminId}` }
    }).pipe(
      map(response => response.data),
      tap(() => {
        this.pendingStoreRequests.update(requests => requests.filter(req => req.id !== id));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('store-request approve'))
    );
  }

  reject(id: number, adminId: number): Observable<StoreRequest> {
    this.workingService.push('store-request reject');

    return this.http.put<ApiResponse<StoreRequest>>(`${this.apiUrl}/store-request/${id}/reject`, {}, {
      headers: { 'Update-By': `${adminId}` }
    }).pipe(
      map(response => response.data),
      tap(() => {
        this.pendingStoreRequests.update(requests => requests.filter(req => req.id !== id));
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        return throwError(() => error.error);
      }),
      finalize(() => this.workingService.drop('store-request reject'))
    );
  }

}
