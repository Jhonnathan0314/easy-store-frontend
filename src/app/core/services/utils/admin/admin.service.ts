import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionService } from '../../session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private isAdmin: boolean = false;
  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin);
  storedIsAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

  private adminMode: boolean = false;
  private adminModeSubject = new BehaviorSubject<boolean>(this.adminMode);
  storedAdminMode$: Observable<boolean> = this.adminModeSubject.asObservable();

  constructor(private sessionService: SessionService) {
    this.validateIsAdmin();
  }

  private validateIsAdmin() {
    this.isAdmin = this.sessionService.getRole() != 'client';
    this.isAdminSubject.next(this.isAdmin);
    this.adminModeSubject.next(this.isAdmin);
  }

  changeAdminMode(adminMode: boolean) {
    if(this.isAdminSubject.getValue())
      this.adminModeSubject.next(adminMode);
  }

}
