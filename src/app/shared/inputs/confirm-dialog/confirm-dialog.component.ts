import { Component, Input, OnChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ToastModule, ConfirmDialogModule],
  templateUrl: './confirm-dialog.component.html',
  providers: [ ConfirmationService, MessageService ]
})
export class ConfirmDialogComponent implements OnChanges {

  @Input() showDialog: boolean = false;

  constructor(
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) { }

  ngOnChanges(): void {
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
