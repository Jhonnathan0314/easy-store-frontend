import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegisterRequest, ResetPasswordRequest } from '../../../models/data-types/security/security-request.model';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../../models/data-types/security/security-response.model';
import { ApiResponse } from 'src/app/core/models/data-types/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  apiUrl: string = environment.BACKEND_URL;

  constructor(private http: HttpClient) { }

  login(loginRequest: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, loginRequest);
  }

  register(registerRequest: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.put<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/reset-password`, request);
  }

}
