import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/core/services/utils/admin/admin.service';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [RouterModule, FormsModule, MenubarModule, ToggleSwitch],
  templateUrl: './menu-bar.component.html'
})
export class MenuBarComponent implements OnInit, OnDestroy {

  @Input() items: MenuItem[] = []; 

  isAdmin: boolean = false;
  adminMode: boolean = false;

  isAdminSubscription: Subscription;
  adminModeSubscription: Subscription;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.adminModeSubscription.unsubscribe();
    this.isAdminSubscription.unsubscribe();
  }

  openSubscriptions() {
    this.isAdminSubscription = this.adminService.storedIsAdmin$.subscribe({
      next: (isAdmin) => {
        this.isAdmin = isAdmin;
      }
    })

    this.adminModeSubscription = this.adminService.storedAdminMode$.subscribe({
      next: (adminMode) => {
        this.adminMode = adminMode;
      }
    })
  }

  eventAdminMode() {
    this.adminService.changeAdminMode(this.adminMode);
  }

}
