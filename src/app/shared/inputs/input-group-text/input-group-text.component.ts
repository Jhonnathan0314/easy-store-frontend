import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-group-text',
  standalone: true,
  imports: [ButtonModule, InputTextModule, ReactiveFormsModule],
  templateUrl: './input-group-text.component.html',
  styleUrls: ['./input-group-text.component.css']
})
export class InputGroupTextComponent implements OnChanges {

  controlValue: FormControl = new FormControl<string | number>('');

  @Input() value: string | number = '';
  @Input() type: string = 'text';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() loading: boolean = false;

  @Output() valueEvent = new EventEmitter<string | number>();
  @Output() clickEvent = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
  }

  validateState() {
    if (this.loading) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }

  sendClickEvent() {
    this.clickEvent.emit(this.controlValue.value.toString());
  }

}
