import { Injectable } from '@angular/core';
import { SessionService } from '../../services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard {
  
  constructor(private sessionService: SessionService){ }

  canActivate() { return !this.sessionService.isLogged(); }

}
