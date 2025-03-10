import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBarComponent } from '@component/shared/menus/menu-bar/menu-bar.component';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/services/session/session.service';
import { AdminService } from 'src/app/core/services/utils/admin/admin.service';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MenuBarComponent],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit, OnDestroy {

  items: MenuItem[] = [];

  mode: string = '';

  adminMode: boolean = false;
  adminModeSubscription: Subscription;

  constructor(
    private themeService: ThemeService, 
    private router: Router, 
    private sessionService: SessionService,
    private adminService: AdminService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.configMenuItems();
  }

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
        this.configMenuItems();
      }
    })
  }

  updateThemeText() {
    const element = this.document.querySelector('html')?.classList;
    this.mode = 'claro';
    if(element?.length == 0) this.mode = 'oscuro';
    this.configMenuItems();
  }

  configMenuItems() {
    this.mode = this.themeService.getMode() === 'claro' ? 'oscuro' : 'claro';

    if(this.adminMode) {
      this.buildItemsObjectAdmin();
    } else {
      this.buildItemsObjectClient();
    }
    
  }

  buildItemsObjectAdmin() {
    this.items = [
      { 
        label: 'Tiendas', 
        icon: 'pi pi-shop',
        items: [
          {
            label: 'Gestionar',
            icon: 'pi pi-list',
            command: () => this.router.navigateByUrl('/dashboard/category')
          },
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            command: () => this.router.navigateByUrl('/dashboard/category/form/0')
          }
        ]
      },
      { 
        label: 'Categorias', 
        icon: 'pi pi-objects-column',
        items: [
          {
            label: 'Gestionar',
            icon: 'pi pi-list',
            command: () => this.router.navigateByUrl('/dashboard/subcategory')
          },
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            command: () => this.router.navigateByUrl('/dashboard/subcategory/form/0')
          }
        ]
      },
      { 
        label: 'Productos', 
        icon: 'pi pi-box',
        items: [
          {
            label: 'Gestionar',
            icon: 'pi pi-list',
            command: () => this.router.navigateByUrl('/dashboard/product')
          },
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            command: () => this.router.navigateByUrl('/dashboard/product/form/0')
          }
        ]
      },
      { 
        label: 'Tipos de pago', 
        icon: 'pi pi-credit-card',
        items: [
          {
            label: 'Gestionar',
            icon: 'pi pi-list',
            command: () => this.router.navigateByUrl('/dashboard/payment-type')
          },
          {
            label: 'Crear',
            icon: 'pi pi-plus',
            command: () => this.router.navigateByUrl('/dashboard/payment-type/form/0')
          }
        ]
      },
      { 
        label: 'Mis carritos', 
        icon: 'pi pi-shopping-cart',
        command: () => this.router.navigateByUrl('/dashboard/store/cart')
      },
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
        items: [
          {
            label: 'Verde',
            command: () => { 
              this.themeService.switchTheme('green');
            }
          },
          {
            label: 'Azul',
            command: () => { 
              this.themeService.switchTheme('sky');
            }
          },
          {
            label: 'Naranja',
            command: () => { 
              this.themeService.switchTheme('amber');
            }
          },
          {
            label: 'Rosado',
            command: () => { 
              this.themeService.switchTheme('pink');
            }
          },
          {
            label: 'Violeta',
            command: () => { 
              this.themeService.switchTheme('violet');
            }
          }
        ],
      },
      {
        label: 'Modo ' + this.mode,
        icon: `pi ${this.mode === 'claro' ? 'pi-sun' : 'pi-moon'}`,
        command: () => { 
          this.themeService.switchMode(this.mode);
          this.configMenuItems();
        }
      },
      { 
        label: 'Salir', 
        icon: 'pi pi-fw pi-sign-out text-primary', 
        command: () => { this.sessionService.logout(); } 
      },
    ];
  }

  buildItemsObjectClient() {
    this.items = [
      { 
        label: 'Mis carritos', 
        icon: 'pi pi-shopping-cart',
        command: () => this.router.navigateByUrl('/dashboard/store/cart')
      },
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
        items: [
          {
            label: 'Verde',
            command: () => { 
              this.themeService.switchTheme('green');
            }
          },
          {
            label: 'Azul',
            command: () => { 
              this.themeService.switchTheme('sky');
            }
          },
          {
            label: 'Naranja',
            command: () => { 
              this.themeService.switchTheme('amber');
            }
          },
          {
            label: 'Rosado',
            command: () => { 
              this.themeService.switchTheme('pink');
            }
          },
          {
            label: 'Violeta',
            command: () => { 
              this.themeService.switchTheme('violet');
            }
          }
        ],
      },
      {
        label: 'Modo ' + this.mode,
        icon: `pi ${this.mode === 'claro' ? 'pi-sun' : 'pi-moon'}`,
        command: () => { 
          this.themeService.switchMode(this.mode);
          this.configMenuItems();
        }
      },
      { 
        label: 'Salir', 
        icon: 'pi pi-fw pi-sign-out text-primary', 
        command: () => { this.sessionService.logout(); } 
      },
    ];
  }

}
