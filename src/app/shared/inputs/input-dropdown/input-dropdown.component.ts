import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrimeNGObject } from 'src/app/core/models/data-types/primeng-object.model';

@Component({
  selector: 'app-input-dropdown',
  templateUrl: './input-dropdown.component.html',
  styleUrls: ['./input-dropdown.component.css']
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

  constructor() { }

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
