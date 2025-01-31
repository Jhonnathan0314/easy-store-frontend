import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGObject } from 'src/app/core/models/data-types/primeng-object.model';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-input-dropdown',
  standalone: true,
  imports: [Select, ReactiveFormsModule],
  templateUrl: './input-dropdown.component.html'
})
export class InputDropdownComponent implements OnChanges {

  controlValue: FormControl = new FormControl<PrimeNGObject>(new PrimeNGObject());

  @Input() options: PrimeNGObject[] = [];
  @Input() selectedOption: PrimeNGObject = new PrimeNGObject();
  @Input() label: string = '';
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<PrimeNGObject>();

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.selectedOption);
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
