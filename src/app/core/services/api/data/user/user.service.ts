import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@models/security/user.model';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { SessionService } from '../../../session/session.service';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '@models/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl: string = '';

  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  storedUsers$: Observable<User[]> = this.usersSubject.asObservable();
  
  constructor(
    private http: HttpClient, 
    private sessionService: SessionService
  ) {
    this.apiUrl = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;
    this.findAll();
  }

  private findAll() {
    const accountId = this.sessionService.getUserId();
    this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/user/account/${accountId}`).subscribe({
      next: (apiResponse) => {
        this.users = apiResponse.data;
        this.usersSubject.next(this.users);
      },
      error: (error) => {
        console.log("error finding users: ", error);
      }
    })
  }

  getAll(): Observable<User[]> {
    return this.storedUsers$.pipe();
  }

  getById(id: number): Observable<User | undefined> {
    return this.storedUsers$.pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  create(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/user`, user).pipe(
      tap(response => {
        this.users.push(response.data);
        this.usersSubject.next(this.users);
      })
    )
  }

  update(user: User): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/user`, user).pipe(
      tap(response => {
        const index = this.users.findIndex(u => u.id == user?.id);
        this.users[index] = response.data;
        this.usersSubject.next(this.users);
      })
    )
  }

  deleteById(id: number) {
    this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/user/delete/${id}`).subscribe({
      next: (response) => {
        this.usersSubject.next(this.users.filter(user => user.id != id));
      },
      error: (error) => {
        if(error.error.code === 404) 
          console.error("Id no encontrado para eliminar usuario.", error);
      }
    })
  }
}
