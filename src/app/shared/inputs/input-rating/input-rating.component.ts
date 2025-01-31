import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-input-rating',
  standalone: true,
  imports: [RatingModule, ReactiveFormsModule],
  templateUrl: './input-rating.component.html',
  styleUrls: ['./input-rating.component.css']
})
export class InputRatingComponent implements OnChanges {

  controlValue: FormControl = new FormControl<number>(0);

  @Input() value: number = 0;
  @Input() disabled: boolean = false;

  @Output() valueEvent = new EventEmitter<number>();

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
