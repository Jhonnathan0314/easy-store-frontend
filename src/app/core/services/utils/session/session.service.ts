import { TokenService } from './../token/token.service';
import { Inject, Injectable, signal } from '@angular/core';
import { LoginRequest } from '../../../models/data-types/security/security-request.model';
import { SessionData } from '../../../models/data-types/security/security-data.model';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  localStorage: Storage | undefined;

  actualPath: string = '';

  session = signal<SessionData | null>(null);

  constructor(
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.session.set(this.getSessionData());
  }

  isLogged(): boolean {
    const object = this.getSessionData();
    if(!object) return false;
    if(!object.isValid()) return false;
    if(this.tokenService.isTokenExpired(object.token)) return false;
    this.session.update(() => this.getSessionData());
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
    // Nota de seguridad: esto NO se cifra. Cifrar en el cliente con una clave
    // que viaja en el propio bundle JS no aporta confidencialidad real (la
    // clave es visible para cualquiera que inspeccione el codigo), asi que
    // guardar el objeto en texto plano es equivalente en seguridad y evita
    // dar una falsa sensacion de proteccion. La autorizacion real vive en el
    // backend (ver PurchaseAuthorizationService y el resto de la API), no en
    // lo que el cliente pueda o no leer de su propio localStorage.
    this.localStorage?.setItem("object", JSON.stringify(sessionData));
    this.session.update(() => this.getSessionData());
  }

  logout() {
    this.localStorage?.removeItem('object');
    this.session.update(() => null);
  }

  private getSessionData(): SessionData | null {
    const raw = this.localStorage?.getItem("object");
    if(!raw) return null;
    try {
      return Object.assign(new SessionData(), JSON.parse(raw));
    } catch {
      // localStorage corrupto o de un formato antiguo (versiones previas
      // cifraban este valor): se descarta en vez de romper el arranque.
      this.localStorage?.removeItem('object');
      return null;
    }
  }

  private getUsername() { return this.getSessionData()?.username ?? ''; }

  private getUserId() { return this.getSessionData()?.userId ?? -1; }

  private getAccountId() { return this.getSessionData()?.accountId ?? -1; }

  private getRole() { return this.getSessionData()?.role ?? ''; }
  
  private getToken() { return this.getSessionData()?.token ?? ''; }

}
