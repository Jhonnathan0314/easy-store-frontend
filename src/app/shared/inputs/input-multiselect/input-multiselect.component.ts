import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGObject } from 'src/app/core/models/data-types/primeng-object.model';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-input-multiselect',
  standalone: true,
  imports: [MultiSelectModule, ReactiveFormsModule],
  templateUrl: './input-multiselect.component.html',
  styleUrls: ['./input-multiselect.component.css']
})
export class InputMultiselectComponent implements OnChanges {

  controlValue: FormControl = new FormControl<PrimeNGObject[]>([]);

  @Input() options: PrimeNGObject[] = [];
  @Input() selectedOptions: PrimeNGObject[] = [];
  @Input() selectionLimit: number;
  @Input() filter: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<PrimeNGObject[]>();

  ngOnChanges(changes: SimpleChanges): void {
    this.controlValue.setValue(this.selectedOptions);
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
