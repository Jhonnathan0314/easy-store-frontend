import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading = signal<boolean>(false);

  constructor() {
    this.loading.set(false);
  }

  setLoading(loading: boolean) {
    if(loading == this.loading()) return;
    this.loading.update(() => loading);
  }

}
