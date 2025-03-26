import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { DataObject, DataObjectValidation } from '@models/utils/object.data-view.model';
import { TableModule } from 'primeng/table';
import { ButtonComponent } from "../../inputs/button/button.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [RouterModule, TableModule, ButtonComponent],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnChanges {

  @Input() objects: DataObject[] = [];
  @Input() purchaseHasProduct: boolean = false;
  @Input() purchaseHasProductIndex: number = -1;
  @Input() updateButton: boolean = false;
  @Input() deleteButton: boolean = false;
  @Input() disableButtons: boolean = false;
  @Input() updateRedirectPath: string = 'home';

  @Output() deleteEvent = new EventEmitter<DataObject>();
  @Output() detailEvent = new EventEmitter<number>();

  hasFields: DataObjectValidation = new DataObjectValidation();

  constructor(private router: Router) { }

  ngOnChanges(): void {
    this.validateHasFields();
  }

  validateHasFields() {
    if(!this.areValidObjects()) return;
    this.hasFields.imageName = this.objects[0].imageName != undefined && this.objects[0].imageName != null;
    this.hasFields.id = this.objects[0].id != undefined && this.objects[0].id != null;
    this.hasFields.name = this.objects[0].name != undefined && this.objects[0].name != null;
    this.hasFields.description = this.objects[0].description != undefined && this.objects[0].description != null;
    this.hasFields.price = this.objects[0].price != undefined && this.objects[0].price != null;
    this.hasFields.quantity = this.objects[0].quantity != undefined && this.objects[0].quantity != null;
    this.hasFields.qualification = this.objects[0].qualification != undefined && this.objects[0].qualification != null;
    this.hasFields.subcategoryName = this.objects[0].subcategoryName != undefined && this.objects[0].subcategoryName != null;
    this.hasFields.categoryName = this.objects[0].categoryName != undefined && this.objects[0].categoryName != null;
    this.hasFields.purchase = this.objects[0].purchase != undefined && this.objects[0].purchase != null;
  }

  areValidObjects(): boolean {
    if(this.objects == undefined || this.objects == null) return false;
    if(this.objects.length == 0) return false;
    return true;
  }

  viewDetail(id: number) {
    this.detailEvent.emit(id)
  }

  updateAction(id: number) {
    this.router.navigateByUrl(`/dashboard/${this.updateRedirectPath}/${id}`);
  }

  deleteAction(id: number) {
    const obj = this.objects.find(obj => obj.id === id) || new DataObject()
    this.deleteEvent.emit(obj);
  }

}
