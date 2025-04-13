import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = signal<string[]>([]);

  constructor() {
    this.loading.set([]);
  }

  push(value: string) {
    this.loading.update(loading => [...loading, value]);
  }

  drop(value: string) {
    this.loading.update(loading => loading.filter(load => load !== value));
  }

}
