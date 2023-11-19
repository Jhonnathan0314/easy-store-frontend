import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  key: string;

  constructor() {
    this.key = environment.CRYPTO_KEY;
  }

  encryptText(value: string): string {
    return AES.encrypt(value, this.key).toString();
  }

  decryptText(value: string): string {
    const bytes = AES.decrypt(value, this.key);
    return bytes.toString(enc.Utf8);
  }

  encryptObject(value: any): string {
    return AES.encrypt(JSON.stringify(value), this.key).toString();
  }

  decryptObject(value: string): any {
    const bytes = AES.decrypt(value, this.key);
    return JSON.parse(bytes.toString(enc.Utf8));
  }

}
