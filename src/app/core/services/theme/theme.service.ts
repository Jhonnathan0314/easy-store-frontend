import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  theme: string = '';
  color: string = '';

  constructor() {
    this.findActualTheme();
  }

  /**
   * The function finds the actual theme by retrieving it from local storage and sets it as the current
   * theme.
   */
  findActualTheme() {
    this.theme = localStorage.getItem('theme') || 'arya-purple';
    this.switchTheme(this.theme);
  }

  /**
   * The function `switchTheme` changes the theme of the app by updating the href attribute of the HTML
   * link element with the provided theme name.
   * @param {string} theme - The `theme` parameter is a string that represents the name of the theme to
   * be applied.
   */
  switchTheme(theme: string) {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    this.theme = theme;
    this.color = this.theme.split('-')[1];
    localStorage.setItem('theme', this.theme);

    if (themeLink) {
      themeLink.href = this.theme + '.css';
    }
  }
}
