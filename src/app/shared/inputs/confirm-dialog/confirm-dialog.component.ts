import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  providers: [ ConfirmationService, MessageService ]
})
export class ConfirmDialogComponent implements OnChanges {

  @Input() showDialog: boolean = false;

  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.showDialog){
      this.confirm();
    }
  }

  confirm() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de continuar?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Proceso en curso...' });
      }
    });
  }

}
