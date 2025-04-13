import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@models/data/general.model';
import { finalize, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkingService } from '../../../utils/working/working.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  apiUrl: string = `${environment.BACKEND_URL}${environment.BACKEND_PATH}`;

  constructor(
    private http: HttpClient,
    private workingService: WorkingService
  ) { }
  
  sendOtpPassword(username: string): Observable<ApiResponse<boolean>> {
    this.workingService.push('sendOtpPassword');
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/email/forgot-password`, {username: username}).pipe(
      finalize(() => this.workingService.drop('sendOtpPassword'))
    );
  }

}
