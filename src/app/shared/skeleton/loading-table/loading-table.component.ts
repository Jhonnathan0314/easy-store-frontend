import { Component } from '@angular/core';
import { DataObject } from '@models/utils/object.data-view.model';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-loading-table',
  standalone: true,
    imports: [SkeletonModule, TableModule],
  templateUrl: './loading-table.component.html'
})
export class LoadingTableComponent {

  objects: DataObject[] = [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ];

}
