import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonIconPosition } from '@enums/primeng.enum';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ ButtonModule, ToastModule, ConfirmPopupModule ],
  templateUrl: './button.component.html',
  providers: [ ConfirmationService, MessageService ]
})
export class ButtonComponent {

  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() severity: "success" | "info" | "warn" | "danger" | "help" | "primary" | "secondary" | "contrast" | null | undefined = 'primary';
  @Input() rounded: boolean = false;
  @Input() iconPos: ButtonIconPosition = ButtonIconPosition.LEFT;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() confirmClick: boolean = false;

  @Output() clickEvent = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) { }

  /**
   * The sendValue function emits a click event.
   */
  sendValue(event: Event) {
    if (this.confirmClick) {
      this.confirmClickAction(event);
    } else {
      this.clickEvent.emit();
    }
  }

  /**
   * The function `confirmClickAction` displays a confirmation dialog and emits a click event if the
   * user accepts the confirmation.
   * @param {Event} event - The event parameter is of type Event and represents the event that
   * triggered the click action. It is used to get the target element of the event.
   */
  confirmClickAction(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estas seguro de continuar?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No'
      },
      acceptButtonProps: {
        label: 'Si'
      },
      accept: () => {
        this.clickEvent.emit();
      },
      reject: () => {}
    });
  }
}
