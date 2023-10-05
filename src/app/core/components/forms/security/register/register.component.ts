import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  loginForm: FormGroup;

  @Output() changeViewEvent = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(24)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(24)]]
    });
  }

  validateForm() {
    /* if(!this.loginForm.valid){
      console.log("FORMULARIO LOGIN INVALIDO");
      return;
    } */

    console.log("VALID LOGIN FORM");
    this.register();
  }

  register(){
    console.log("LOGIN METHOD");
    this.changeView();
  }

  changeView() {
    this.changeViewEvent.emit('register');
  }

}
