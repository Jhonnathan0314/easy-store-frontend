import { Component, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FormErrors } from 'src/app/core/models/data-types/security/security-error.model';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { MessageComponent } from 'src/app/shared/informative/message/message.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  providers: [ MessageService ]
})
export class SecurityComponent {

  @ViewChild(MessageComponent) messageComponent: MessageComponent;

  items: MenuItem[] = [];
  detailError: string = '';

  constructor(public themeService: ThemeService) {
    this.configMenuItems();
  }

  configMenuItems() {
    this.items = [
      {
        label: 'Temas',
        icon: 'pi pi-fw pi-palette',
        items: [
          {
            label: 'Azul claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-blue'); }
          },
          {
            label: 'Verde claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-green'); }
          },
          {
            label: 'Naranja claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-orange'); }
          },
          {
            label: 'Purpura claro',
            escape: true,
            command: () => { this.themeService.switchTheme('saga-purple'); }
          },
          {
            label: 'Azul oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-blue'); }
          },
          {
            label: 'Verde oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-green'); }
          },
          {
            label: 'Naranja oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-orange'); }
          },
          {
            label: 'Purpura oscuro',
            escape: true,
            command: () => { this.themeService.switchTheme('arya-purple'); }
          }
        ],
      },
      {
        label: 'Ayuda y soporte',
        icon: 'pi pi-fw pi-question-circle',
        command: () => { } 
      }
    ];
  }

  changeViewEvent(oldView: string) {
    let formContainer = document.getElementById('form-card');
    const classes = 'flip-card-inner w-full h-full';
    formContainer?.setAttribute('class', oldView == 'login' ? classes + ' change-view' : classes);
  }

  showFormErrors(formErrors: FormErrors) {
    Object.keys(formErrors).forEach(field => {
      this.detailError = `El campo ${field} `;
      if(formErrors[field].includes('required')) this.detailError += 'es obligatorio.';
      if(formErrors[field].includes('email')) this.detailError += 'no es un correo valido.';
      this.messageComponent.showError('Error en el formulario', this.detailError);
    });
  }

}
