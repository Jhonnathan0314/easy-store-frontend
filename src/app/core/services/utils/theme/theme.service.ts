import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LaraAmberPreset } from '@theme/lara-amber';
import { LaraGreenPreset } from '@theme/lara-green';
import { LaraPinkPreset } from '@theme/lara-pink';
import { LaraSkyPreset } from '@theme/lara-sky';
import { LaraVioletreset } from '@theme/lara-violet';
import { PrimeNG } from 'primeng/config';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private themes = {
    green: LaraGreenPreset,
    sky: LaraSkyPreset,
    amber: LaraAmberPreset,
    pink: LaraPinkPreset,
    violet: LaraVioletreset
  }

  localStorage: Storage | undefined;

  constructor(@Inject(DOCUMENT) private document: Document, private primeng: PrimeNG) {
    this.localStorage = this.document.defaultView?.localStorage;
    this.findActualOptions()
  }

  private findActualOptions() {
    this.setMode();
    this.setTheme();
  }

  setMode() {
    const actualMode = this.getMode();
    const classList = this.getClasslist();
    if(
      (actualMode === 'claro' && !classList?.contains('my-app-dark')) ||
      (actualMode === 'oscuro' && classList?.contains('my-app-dark'))
    ) return;

    if(
      (actualMode === 'oscuro' && !classList?.contains('my-app-dark')) || 
      (actualMode === 'claro' && classList?.contains('my-app-dark'))
    ) {
      this.switchMode(actualMode)
    }
  }

  setTheme() {
    const actualThemeStr = this.getTheme();
    let actualTheme: 'green' | 'sky' | 'amber' | 'pink' | 'violet' = 'green';
    if(
      actualThemeStr === 'sky' || 
      actualThemeStr === 'amber' || 
      actualThemeStr === 'pink' || 
      actualThemeStr === 'violet'
    ) {
      actualTheme = actualThemeStr;
    }
    this.switchTheme(actualTheme)
  }

  switchMode(newState: string) {
    this.document.querySelector('html')?.classList.toggle('my-app-dark');;
    this.localStorage?.setItem('mode', newState);
  }

  switchTheme(theme: 'green' | 'sky' | 'amber' | 'pink' | 'violet') {
    this.primeng.theme.set({
      preset: this.themes[theme],
      options: {
        darkModeSelector: '.my-app-dark',
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities'
        }
      }
    })
    this.localStorage?.setItem('theme', theme);
  }

  private getClasslist() {
    return this.document.querySelector('html')?.classList;
  }

  getMode() {
    return this.localStorage?.getItem('mode') ?? 'claro';
  }

  getTheme() {
    return this.localStorage?.getItem('theme') ?? 'green';
  }
}
