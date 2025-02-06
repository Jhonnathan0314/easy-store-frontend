import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselHomeComponent } from '@component/core/global/carousel-home/carousel-home.component';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { Subscription } from 'rxjs';
import { AdminService } from 'src/app/core/services/utils/admin/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CarouselHomeComponent, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrls: ['../../../../../../public/assets/css/layout.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  adminMode: boolean = false;
  adminModeSubscription: Subscription;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.openSubscriptions();
  }

  ngOnDestroy(): void {
    this.adminModeSubscription.unsubscribe();
  }

  openSubscriptions() {
    this.adminModeSubscription = this.adminService.storedAdminMode$.subscribe({
      next: (adminMode) => {
        this.adminMode = adminMode;
      }
    })
  }

  redirectTo(path: string) {
    this.router.navigateByUrl(path);
  }

}
