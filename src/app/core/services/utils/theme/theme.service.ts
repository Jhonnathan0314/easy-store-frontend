import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  theme: string = '';
  color: string = '';
  
  localStorage: Storage | undefined;

  constructor() {
    
  }

  /**
   * The function finds the actual theme by retrieving it from local storage and sets it as the current
   * theme.
   */
  findActualTheme() {
    
  }

  /**
   * The function `switchTheme` changes the theme of the app by updating the href attribute of the HTML
   * link element with the provided theme name.
   * @param {string} theme - The `theme` parameter is a string that represents the name of the theme to
   * be applied.
   */
  switchTheme(theme: string) {
    
  }
}
