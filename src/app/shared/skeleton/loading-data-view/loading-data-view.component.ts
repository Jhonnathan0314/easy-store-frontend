import { Component } from '@angular/core';
import { DataObject } from '@models/utils/object.data-view.model';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loading-data-view',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './loading-data-view.component.html'
})
export class LoadingDataViewComponent {

  objects: DataObject[] = [ {}, {}, {}, {}, {}, {}, {} ];

}
