import { Inject, Injectable, signal } from '@angular/core';
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

  role = signal<string>('');

  constructor(
    private cryptoService: CryptoService, 
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.role.set(this.getRole());
  }

  isLogged(): boolean {
    const object = this.getSessionData();
    if(!object) return false;
    if(!object.isValid()) return false;
    if(this.isTokenExpired(object.token)) return false;
    this.role.update(() => this.getRole());
    return true;
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
    this.role.update(() => this.getTokenAttribute(token, "user_role"));
  }

  logout() {
    this.localStorage?.removeItem('object');
    this.role.update(() => '');
  }

  isTokenExpired(token: string): boolean {
    const tokenPayload = this.decodeTokenPayload(token);
    if (!tokenPayload) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return tokenPayload.exp < now;
  }

  private getSessionData(): SessionData | null {
    if(this.localStorage?.getItem("object")) {
      return Object.assign(new SessionData(), this.cryptoService.decryptObject(this.localStorage?.getItem("object") ?? ""));
    } else {
      return null;
    }
  }

  private getTokenAttribute(token: string, attribute: string) {
    return this.decodeTokenPayload(token)[attribute];
  }

  private decodeTokenPayload(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  }

  getUsername() { return this.getSessionData()?.username ?? ''; }

  getUserId() { return this.getSessionData()?.userId ?? -1; }

  getAccountId() { return this.getSessionData()?.accountId ?? -1; }

  getRole() { return this.getSessionData()?.role ?? ''; }
  
  getToken() { return this.getSessionData()?.token ?? ''; }

}
