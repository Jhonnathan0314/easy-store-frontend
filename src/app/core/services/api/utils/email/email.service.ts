import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@models/data/general.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  constructor(private http: HttpClient) { }
  
  sendOtpPassword(username: string): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/email/forgot-password`, {username: username});
  }

}
