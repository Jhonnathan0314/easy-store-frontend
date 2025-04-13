import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { SessionService } from '../../services/utils/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard {

  constructor(
    private router: Router,
    private sessionService: SessionService
  ){ }

  canActivate() { 
    const isAdmin = this.sessionService.session() && this.sessionService.session()?.role === 'admin';
    if(!isAdmin) this.router.navigateByUrl('/dashboard/home');
    return isAdmin;
  }
  
}
