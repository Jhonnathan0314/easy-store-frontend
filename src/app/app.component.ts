import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { SessionService } from './core/services/session/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private primeng: PrimeNG,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.primeng.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100
    };

    this.sessionService.validateSession();
  }

}
