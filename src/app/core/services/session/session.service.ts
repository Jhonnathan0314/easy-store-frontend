import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginRequest } from '../../models/data-types/security/security-request.model';
import { SessionData } from '../../models/data-types/security/security-data.model';
import { CryptoService } from '../utils/crypto/crypto.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  localStorage: Storage | undefined;

  actualPath: string = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private cryptoService: CryptoService, @Inject(DOCUMENT) private document: Document) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.validateSession();
  }

  saveSession(loginRequest: LoginRequest, token: string) {
    const sessionData = {
      token: token,
      username: loginRequest.username,
      role: this.getTokenAttribute(token, "user_role"),
      userId: this.getTokenAttribute(token, "user_id"),
      accountId: this.getTokenAttribute(token, "account_id"),
    };
    this.localStorage?.setItem("object", this.cryptoService.encryptObject(sessionData));
    if (this.isTokenExpired() || !this.isValidSessionData()) this.logout();
    this.validateSession();
  }

  logout() {
    this.localStorage?.removeItem('object');
    this.redirect('/security/login');
  }

  private validateSession() {
    if (this.isLogged()) {
      this.actualPath = window.location.href;
      if(!this.actualPath.includes('dashboard')) this.redirect('/dashboard');
    } else {
      this.logout();
    }
  }

  private isValidSessionData(): boolean {
    return this.getSessionData().isValid() && !this.isTokenExpired();
  }

  isLogged(): boolean {
    return this.localStorage?.getItem("object") != null && this.isValidSessionData();
  }

  private redirect(path: string) {
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

  private decodePayload(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  private getSessionData(): SessionData {
    return this.cryptoService.decryptObject(this.localStorage?.getItem("object") ?? "") as SessionData;
  }

  private getTokenAttribute(token: string, attribute: string) {
    return this.decodePayload(token)[attribute];
  }

  getUsername() { return this.getSessionData().username; }

  getUserId() { return this.getSessionData().userId; }

  getAccountId() { return this.getSessionData().accountId; }

  getRole() { return this.getSessionData().role; }
  
  getToken() { return this.getSessionData().token; }

}
