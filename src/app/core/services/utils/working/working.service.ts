import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkingService {

  working = signal<string[]>([]);
  
  constructor() {
    this.working.set([]);
  }

  push(value: string) {
    this.working.update(working => [...working, value]);
    console.log("Push working: ", {value, working: this.working()});
  }

  drop(value: string) {
    this.working.update(working => working.filter(work => work !== value));
    console.log("Drop working: ", {value, working: this.working()});
  }

}
