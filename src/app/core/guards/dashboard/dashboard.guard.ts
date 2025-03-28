import { Router } from '@angular/router';
import { computed, Injectable, Signal } from '@angular/core';
import { SessionService } from '../../services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {
  
  role: Signal<string> = computed(() => this.sessionService.role());

  constructor(
    private router: Router,
    private sessionService: SessionService
  ){ }

  canActivate() { 
    const isAdmin = this.role() === 'admin';
    if(!isAdmin) this.router.navigateByUrl('/dashboard/home');
    return isAdmin;
  }
  
}
