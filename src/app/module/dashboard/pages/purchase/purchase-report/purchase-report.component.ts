import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Category } from '@models/data/category.model';
import { DataObject } from '@models/utils/object.data-view.model';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-purchase-report',
  standalone: true,
  imports: [RouterModule, ChartModule, DividerModule],
  templateUrl: './purchase-report.component.html',
})
export class PurchaseReportComponent implements OnInit {
  
  @Input() purchases: DataObject[] = [];
  @Input() categories: Category[] = [];

  valueData: any;
  numData: any;

  valueLabels: string[] = ['2024-11', '2024-12', '2025-01', '2025-02']
  numLabels: string[] = []

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.graphicData();
  }

  graphicData() {
    const valueData = this.getValueData();
    const numData = this.getNumData();

    this.valueData = {
      labels: this.valueLabels,
      datasets: [
        {
          label: 'Compras',
          data: valueData,
          borderWidth: 1,
        },
      ],
    };

    this.numData = {
      labels: this.numLabels,
      datasets: [
        {
          label: 'Compras',
          data: numData,
          borderWidth: 1,
        },
      ],
    };
  }

  getValueData() {
    let data = this.valueLabels.map(() => 0);

    this.purchases.forEach(purchase => {
      if(purchase.purchase) {
        const date = new Date(purchase.purchase.creationDate);
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
        const index = this.valueLabels.indexOf(yearMonth);
        if (index !== -1) {
          data[index] += purchase.purchase.total;
        }
      }
    });
    return data;
  }

  getNumData() {
    this.numLabels = this.categories.map(category => category.name);
    let data = this.numLabels.map(() => 0)

    this.purchases.forEach(purchase => {
      if(purchase.purchase) {
        if(purchase.purchase.category) {
          const index = this.numLabels.indexOf(purchase.purchase.category.name);
          data[index] += 1;
        }
      }
    });
    return data;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard/home');
  }
}
