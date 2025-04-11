import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  isTokenExpired(token: string): boolean {
    const tokenPayload = this.decodeTokenPayload(token);
    if (!tokenPayload) return true;

    const now = Math.floor(new Date().getTime() / 1000);
    return tokenPayload.exp < now;
  }

  getTokenAttribute(token: string, attribute: string) {
    return this.decodeTokenPayload(token)[attribute];
  }

  private decodeTokenPayload(token: string) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  }


}
