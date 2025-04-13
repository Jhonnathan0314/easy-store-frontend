import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../../../models/data-types/security/security-request.model';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { AuthResponse } from '../../../models/data-types/security/security-response.model';
import { ApiResponse, ErrorMessage } from 'src/app/core/models/data-types/data/general.model';
import { SessionService } from '../../utils/session/session.service';
import { TokenService } from '../../utils/token/token.service';
import { WorkingService } from '../../utils/working/working.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  apiUrl: string = environment.BACKEND_URL;

  security = signal<string>('');
  securityError = signal<ErrorMessage | null>(null);

  constructor(
    private http: HttpClient,
    private workingService: WorkingService,
    private sessionService: SessionService,
    private tokenService: TokenService
  ) {
    this.security.set(sessionService.isLogged() ? sessionService.getToken() : '');
    this.securityError.set(null);
  }

  login(loginRequest: LoginRequest) {
    this.workingService.push('login');
    this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, loginRequest).pipe(
      map(response => response.data.token),
      tap(token => {
        this.validateTokenReceived(loginRequest, token);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.securityError.update(() => error.error.error)
        return throwError(() => error.error.error);
      }),
      finalize(() => this.workingService.drop('login'))
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
    this.workingService.push('register');
    this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, registerRequest).pipe(
      map(response => response.data.token),
      tap(token => {
        this.validateTokenReceived(this.getLoginFromRegisterRequest(registerRequest), token);
      }),
      catchError((error: {error: ApiResponse<ErrorMessage>}) => {
        this.securityError.update(() => error.error.error)
        return throwError(() => error.error.error);
      }),
      finalize(() => this.workingService.drop('register'))
    ).subscribe();
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<AuthResponse>> {
    this.workingService.push('resetPassword');
    return this.http.put<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/reset-password`, request).pipe(
      finalize(() => this.workingService.drop('resetPassword'))
    );
  }

  logout(action: 'login' | 'register' | 'logout' | '') {
    this.sessionService.logout();
    this.security.update(() => action);
  }

  private validateTokenReceived(request: LoginRequest, token: string) {
    const isTokenExpired = this.tokenService.isTokenExpired(token);
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
