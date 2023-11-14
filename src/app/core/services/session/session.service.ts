import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../../models/data-types/security/security-request.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  apiUrl: string = '';
  username: string = '';

  constructor(private router: Router, private http: HttpClient) {
    this.apiUrl = environment.BACKEND_URL;
    this.validateSession();
  }

  saveSession(loginRequest: LoginRequest, token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("username", loginRequest.username);
    if(this.isTokenExpired()) this.logout();
    this.validateSession();
  }

  logout() {
    localStorage.clear();
    this.redirect('/security');
  }

  validateSession() {
    if(this.isLogged()){
      this.redirect('/dashboard');
    } else {
      this.logout();
    }
  }

  isLogged(): boolean {
    return localStorage.getItem("token") != null && localStorage.getItem("token") != undefined;
  }

  redirect(path: string) {
    this.router.navigateByUrl(path);
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem("token") || "";
    const tokenPayload = this.decodePayload(token)

    if (!tokenPayload) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return tokenPayload.exp < now;
  }

  private decodePayload(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  getUsername() { return localStorage.getItem("username") || ''; }
  
}
