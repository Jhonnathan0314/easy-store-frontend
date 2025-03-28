import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../../../models/data-types/security/security-request.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '../../../models/data-types/security/security-response.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/data-types/data/general.model';
import { SessionService } from '../../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  apiUrl: string = environment.BACKEND_URL;

  security = signal<string>('');
  securityError = signal<ErrorMessage | null>(null);

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) {
    this.securityError.set(null);
  }

  login(loginRequest: LoginRequest) {
    this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, loginRequest).pipe(
      map(response => response.data.token),
      tap(token => {
        this.validateTokenReceived(loginRequest, token);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.securityError.update(() => error.error.error)
        return throwError(() => error.error.error);
      })
    ).subscribe();
  }

  loginGhost() {
    this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, this.getGhostRequest()).pipe(
      map(response => response.data.token),
      tap(token => {
        this.validateTokenReceived(this.getGhostRequest(), token);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.securityError.update(() => error.error.error)
        return throwError(() => error.error.error);
      })
    ).subscribe();
  }

  register(registerRequest: RegisterRequest) {
    this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, registerRequest).pipe(
      map(response => response.data.token),
      tap(token => {
        this.validateTokenReceived(this.getLoginFromRegisterRequest(registerRequest), token);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.securityError.update(() => error.error.error)
        return throwError(() => error.error.error);
      })
    ).subscribe();
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.put<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/reset-password`, request);
  }

  logout(action: 'login' | 'register' | 'logout' | '') {
    this.sessionService.logout();
    this.security.update(() => action);
  }

  private validateTokenReceived(request: LoginRequest, token: string) {
    const isTokenExpired = this.sessionService.isTokenExpired(token);
    if(isTokenExpired) {
      this.securityError.update(() => {
        return {code: 401, title: 'Token inválido', detail: 'El token está expirado'} as ErrorMessage;
      })
      this.security.update(() => '');
    } else {
      this.security.update(() => token);
      this.sessionService.saveSession(request, token);
    }
  }
  
  private getLoginFromRegisterRequest(registerRequest: RegisterRequest): LoginRequest {
    return { username: registerRequest.username, password: registerRequest.password };
  }

  private getGhostRequest(): LoginRequest {
    return { username: 'ghost@gmail.com', password: '' }
  }

}
