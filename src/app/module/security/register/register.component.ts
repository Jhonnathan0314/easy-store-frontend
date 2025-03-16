import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputPasswordComponent } from '@component/shared/inputs/input-password/input-password.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { FormErrors } from '@models/security/security-error.model';
import { RegisterRequest } from '@models/security/security-request.model';
import { SecurityService } from 'src/app/core/services/api/security/security.service';
import { SessionService } from 'src/app/core/services/session/session.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, InputTextComponent, InputPasswordComponent, ButtonComponent],
  templateUrl: './register.component.html',
  styleUrls: ['../../../../../public/assets/css/layout.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerRequest: RegisterRequest = new RegisterRequest();
  formErrors: FormErrors;

  @Output() registerErrorEvent = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder, 
    private securityService: SecurityService, 
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
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

  receiveValue(key: string, value: string) {
    this.registerForm.value[key] = value;
  }

  validateForm() {
    this.registerForm.markAllAsTouched();
    if(!this.registerForm.valid || !this.arePasswordEquals()) {
      return;
    }

    const role = {
      id: 3,
      name: 'admin'
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
    this.securityService.register(this.registerRequest).subscribe({
      next: (res) => this.sessionService.saveSession(this.registerRequest, res.data.token),
      error: (error) => console.log("Error en register: ", error)
    });
  }

}
