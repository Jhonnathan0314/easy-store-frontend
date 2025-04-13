import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { User } from '@models/security/user.model';
import { catchError, finalize, map, tap, throwError } from 'rxjs';
import { SessionService } from '../../../utils/session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { LoadingService } from '../../../utils/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  users = signal<User[]>([]);
  usersError = signal<ErrorMessage | null>(null);
  
  constructor(
    private http: HttpClient, 
    private loadingService: LoadingService,
    private sessionService: SessionService
  ) {
    this.findAllByAccount();
  }

  private findAllByAccount() {
    this.loadingService.push('user findAllByAccount');

    const accountId = this.sessionService.getUserId();

    this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/user/account/${accountId}`).pipe(
      map(response => response.data),
      tap(users => {
        this.users.set(users);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.usersError.set(error.error.error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.drop('user findAllByAccount'))
    ).subscribe()
  }

  getById(id: number): Signal<User | undefined> {
    return computed(() => this.users().find(user => user.id === id));
  }

}
