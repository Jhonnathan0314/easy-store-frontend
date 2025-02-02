import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  localStorage: Storage | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.findActualTheme()
  }

  findActualTheme() {
    if(this.document.defaultView?.sessionStorage == undefined) return;
    const actualTheme = this.document.defaultView?.sessionStorage.getItem('theme') ?? 'Claro';
    if(actualTheme === 'Oscuro') this.switchTheme('my-app-dark', actualTheme)
  }

  switchTheme(theme: string, newState: string) {
    this.document.defaultView?.sessionStorage.setItem('theme', newState);
    const element = this.document.querySelector('html')?.classList;
    element?.toggle(theme);
  }
}
