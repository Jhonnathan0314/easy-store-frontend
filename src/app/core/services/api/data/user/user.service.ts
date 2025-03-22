import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { User } from '@models/security/user.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  users = signal<User[]>([]);
  usersError = signal<ErrorMessage | null>(null);
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) {
    this.findAll();
  }

  private findAll() {
    const accountId = this.sessionService.getUserId();
    this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/user/account/${accountId}`).pipe(
      map(response => response.data),
      tap(users => {
        this.users.set(users);
      }),
      catchError((error: ApiResponse<ErrorMessage>) => {
        this.usersError.set(error.error);
        return throwError(() => error);
      })
    ).subscribe()
  }

  getById(id: number): Signal<User | undefined> {
    return computed(() => this.users().find(user => user.id === id));
  }

  create(user: User): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/user`, user).pipe(
      map(response => response.data),
      tap(userCreated => {
        this.users.update(users => [...users, userCreated])
      })
    )
  }

  update(user: User): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/user`, user).pipe(
      map(response => response.data),
      tap(userUpdated => {
        this.users.update(users => users.map(us => us.id === user.id 
          ? userUpdated 
          : us
        ));
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<object>>(`${this.apiUrl}/user/delete/${id}`).pipe(
      tap(() => {
        this.users.update(users => users.filter(user => user.id != id));
      })
    ).subscribe()
  }
}
