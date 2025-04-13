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
    console.log("Push loading: ", {value});
  }

  drop(value: string) {
    this.loading.update(loading => loading.filter(load => load !== value));
    console.log("Drop loading: ", {value});
  }

}
