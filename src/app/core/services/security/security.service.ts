import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  email: string = '';

  constructor(private router: Router) { }

  isLogged() {
    return true;
  }

  register() { }
  
  login() {
    this.router.navigateByUrl('/dashboard/home');
  }

  logout() {
    this.router.navigateByUrl('/security');
  }

  getEmail() {
    return this.email;
  }

}
