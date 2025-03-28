import { Component, computed, effect, EventEmitter, Injector, Output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { ErrorMessage } from '@models/data/general.model';
import { RegisterRequest, LoginRequest } from '@models/security/security-request.model';
import { MessageModule } from 'primeng/message';
import { SecurityService } from 'src/app/core/services/api/security/security.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, MessageModule, InputTextComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerRequest: RegisterRequest = new RegisterRequest();
  loginRequest: LoginRequest = new LoginRequest();
  
  securityError: Signal<ErrorMessage | null> = computed(() => this.securityService.securityError());

  isWorking: boolean = false;
  registerError: boolean = false;

  @Output() registerErrorEvent = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, 
    private injector: Injector,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.validateSecurityError();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
  
  validateSecurityError() {
    effect(() => {
      if(this.securityError() == null) {
        this.registerError = false;
        return;
      }
      this.registerError = true;
      this.isWorking = false;
    }, {injector: this.injector})
  }

  validateForm() {
    this.registerForm.markAllAsTouched();
    if(!this.registerForm.valid || !this.arePasswordEquals()) {
      return;
    }

    const role = {
      id: 1,
      name: 'client'
    }
    this.registerRequest = {
      name: this.registerForm.value.name,
      lastName: this.registerForm.value.lastName,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password,
      role: role
    };

    this.register();
  }

  arePasswordEquals() {
    return this.registerForm.value.password == this.registerForm.value.confirmPassword;
  }

  register(){
    this.isWorking = true;
    this.securityService.register(this.registerRequest);
  }

  receiveValue(key: string, value: string) {
    this.registerForm.value[key] = value;
  }

}
