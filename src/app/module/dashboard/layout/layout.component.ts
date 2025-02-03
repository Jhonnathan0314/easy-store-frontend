import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '@component/core/global/topbar/topbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, TopbarComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {

}
