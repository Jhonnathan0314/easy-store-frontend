import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkingService {

  working = signal<boolean>(false);
  
  constructor() {
    this.working.set(false);
  }

  setWorking(working: boolean) {
    if(working == this.working()) return;
    this.working.update(() => working);
  }

}
