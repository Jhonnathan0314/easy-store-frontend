import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/data-types/security/security-request.model';
import { SessionData } from '../../models/data-types/security/security-data.model';
import { CryptoService } from '../utils/crypto/crypto.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  localStorage: Storage | undefined;

  constructor(private router: Router, private cryptoService: CryptoService, @Inject(DOCUMENT) private document: Document) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.validateSession();
  }

  saveSession(loginRequest: LoginRequest, token: string) {
    const sessionData = {
      token: token,
      username: loginRequest.username,
      role: this.getTokenAttribute(token, "user_role")
    };
    this.localStorage?.setItem("object", this.cryptoService.encryptObject(sessionData));
    if (this.isTokenExpired() || !this.isValidSessionData()) this.logout();
    this.validateSession();
  }

  logout() {
    this.localStorage?.removeItem('object');
    this.redirect('/security/login');
  }

  validateSession() {
    if (this.isLogged()) {
      this.redirect('/dashboard');
    } else {
      this.logout();
    }
  }

  isValidSessionData(): boolean {
    return this.getSessionData().isValid() && !this.isTokenExpired();
  }

  isLogged(): boolean {
    return this.localStorage?.getItem("object") != null && this.isValidSessionData();
  }

  redirect(path: string) {
    this.router.navigateByUrl(path);
  }

  isTokenExpired(): boolean {
    const sessionData = this.getSessionData();
    const token = sessionData.token;
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

  getSessionData(): SessionData {
    const localStorageValue = this.cryptoService.decryptObject(this.localStorage?.getItem("object") ?? "");

    let sessionData: SessionData = new SessionData();
    sessionData.token = localStorageValue.token;
    sessionData.username = localStorageValue.username;
    sessionData.role = localStorageValue.role;
    
    return sessionData;
  }

  getTokenAttribute(token: string, attribute: string) {
    return this.decodePayload(token)[attribute];
  }

  getUsername() { return this.getSessionData().username; }

  getRole() { return this.getSessionData().role; }
  
  getToken() { return this.getSessionData().token; }

}
