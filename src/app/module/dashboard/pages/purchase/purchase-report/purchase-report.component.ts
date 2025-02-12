import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../../../shared/inputs/button/button.component';
import { Router, RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-purchase-report',
  standalone: true,
  imports: [RouterModule, ButtonComponent, ChartModule],
  templateUrl: './purchase-report.component.html',
})
export class PurchaseReportComponent implements OnInit {
  
  basicData: any;
  basicOptions: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.basicData = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          borderWidth: 1,
        },
      ],
    };
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }
}
