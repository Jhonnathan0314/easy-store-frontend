import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SecurityTopbarComponent } from '@component/core/security/topbar/topbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [RouterOutlet, SecurityTopbarComponent],
  templateUrl: './security.component.html',
  providers: [ MessageService ]
})
export class SecurityComponent {

}
