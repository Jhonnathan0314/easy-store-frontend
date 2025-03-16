import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '@component/core/global/topbar/topbar.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent],
  templateUrl: './layout.component.html',
  providers: [ MessageService ]
})
export class LayoutComponent {

}
