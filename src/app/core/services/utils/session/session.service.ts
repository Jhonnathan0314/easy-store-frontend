import { TokenService } from './../token/token.service';
import { Inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../../models/data-types/security/security-request.model';
import { SessionData } from '../../../models/data-types/security/security-data.model';
import { DOCUMENT } from '@angular/common';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  localStorage: Storage | undefined;

  actualPath: string = '';

  role = signal<string>('');

  constructor(
    private cryptoService: CryptoService, 
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.role.set(this.getRole());
  }

  isLogged(): boolean {
    const object = this.getSessionData();
    if(!object) return false;
    if(!object.isValid()) return false;
    if(this.tokenService.isTokenExpired(object.token)) return false;
    this.role.update(() => this.getRole());
    return true;
  }

  saveSession(loginRequest: LoginRequest, token: string) {
    const sessionData = {
      token: token,
      username: loginRequest.username,
      role: this.tokenService.getTokenAttribute(token, "user_role"),
      userId: this.tokenService.getTokenAttribute(token, "user_id"),
      accountId: this.tokenService.getTokenAttribute(token, "account_id"),
    };
    this.localStorage?.setItem("object", this.cryptoService.encryptObject(sessionData));
    this.role.update(() => this.tokenService.getTokenAttribute(token, "user_role"));
  }

  logout() {
    this.localStorage?.removeItem('object');
    this.role.update(() => '');
  }

  private getSessionData(): SessionData | null {
    if(this.localStorage?.getItem("object")) {
      return Object.assign(new SessionData(), this.cryptoService.decryptObject(this.localStorage?.getItem("object") ?? ""));
    } else {
      return null;
    }
  }

  getUsername() { return this.getSessionData()?.username ?? ''; }

  getUserId() { return this.getSessionData()?.userId ?? -1; }

  getAccountId() { return this.getSessionData()?.accountId ?? -1; }

  getRole() { return this.getSessionData()?.role ?? ''; }
  
  getToken() { return this.getSessionData()?.token ?? ''; }

}
