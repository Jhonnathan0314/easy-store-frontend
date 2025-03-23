import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loading-form',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './loading-form.component.html'
})
export class LoadingFormComponent {

}
