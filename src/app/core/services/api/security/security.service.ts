import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequest, RegisterRequest } from '../../../models/data-types/security/security-request.model';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../../models/data-types/security/security-response.model';
import { ApiResponse } from 'src/app/core/models/data-types/data/general.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  apiUrl: string = '';

  constructor(private http: HttpClient) {
    this.apiUrl = environment.BACKEND_URL;
  }

  register(registerRequest: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  login(loginRequest: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/auth/login`, loginRequest);
  }

}
