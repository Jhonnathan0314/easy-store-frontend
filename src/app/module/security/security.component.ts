import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormErrors } from '@models/security/security-error.model';
import { MessageService } from 'primeng/api';
import { ThemeService } from 'src/app/core/services/utils/theme/theme.service';
import { MessageComponent } from 'src/app/shared/informative/message/message.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'],
  providers: [ MessageService ]
})
export class SecurityComponent implements OnDestroy {

  @ViewChild(MessageComponent) messageComponent: MessageComponent;

  loginSubscription: Subscription | undefined;
  registerSubscription: Subscription | undefined;

  detailError: string = '';

  constructor(public themeService: ThemeService) {}

  /**
   * The function onActivate is used to subscribe to error events from LoginComponent and
   * RegisterComponent and display the form errors.
   * @param {Component} componentRef - The componentRef parameter is a reference to the component that
   * is being activated. It is used to determine the type of component and subscribe to the appropriate
   * error event.
   */
  onActivate(componentRef: Component) {
    this.loginSubscription = undefined;
    this.registerSubscription = undefined;
    if (componentRef instanceof LoginComponent) {
      this.loginSubscription = componentRef.loginErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
    if (componentRef instanceof RegisterComponent) {
      this.registerSubscription = componentRef.registerErrorEvent.subscribe((errors) => this.showFormErrors(errors));
    }
  }

  /**
   * The ngOnDestroy function is used to unsubscribe from any active subscriptions for the login and
   * register processes.
   */
  ngOnDestroy(): void {
    if(this.loginSubscription) this.loginSubscription.unsubscribe();
    if(this.registerSubscription) this.registerSubscription.unsubscribe();
  }

  /**
   * The function "showFormErrors" displays error messages for each field in a form.
   * @param {FormErrors} formErrors - An object that contains the errors for each field in a form. The
   * keys of the object represent the field names, and the values are arrays of error messages for each
   * field.
   */
  showFormErrors(formErrors: FormErrors) {
    Object.keys(formErrors).forEach(field => {
      this.detailError = `El campo ${field} `;
      if(formErrors[field].includes('required')) this.detailError += 'es obligatorio.';
      if(formErrors[field].includes('email')) this.detailError += 'no es un correo valido.';
      this.messageComponent.showError('Error en el formulario', this.detailError);
    });
  }

}
