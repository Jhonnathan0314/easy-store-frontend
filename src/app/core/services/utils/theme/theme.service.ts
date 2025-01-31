import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  theme: string = '';
  color: string = '';
  
  localStorage: Storage | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.findActualTheme()
  }

  /**
   * The function finds the actual theme by retrieving it from local storage and sets it as the current
   * theme.
   */
  findActualTheme() {
    if(this.document.defaultView?.sessionStorage == undefined) return;
    const actualTheme = this.document.defaultView?.sessionStorage.getItem('theme') ?? 'Claro';
    if(actualTheme === 'Oscuro') this.switchTheme('my-app-dark', actualTheme)
  }

  /**
   * The function `switchTheme` changes the theme of the app by updating the href attribute of the HTML
   * link element with the provided theme name.
   * @param {string} theme - The `theme` parameter is a string that represents the name of the theme to
   * be applied.
   */
  switchTheme(theme: string, newState: string) {
    this.document.defaultView?.sessionStorage.setItem('theme', newState);
    const element = this.document.querySelector('html')?.classList;
    element?.toggle(theme);
  }
}
