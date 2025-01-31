import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [InputNumberModule, ReactiveFormsModule],
  templateUrl: './input-number.component.html'
})
export class InputNumberComponent implements OnChanges {

  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<number>();

  controlValue: FormControl = new FormControl<number>(this.value);

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.value);
    this.validateState();
  }

  validateState() {
    if (this.disabled) {
      this.controlValue.disable();
    } else {
      this.controlValue.enable();
    }
  }

  sendValue() {
    this.valueEvent.emit(this.controlValue.value);
  }

}
