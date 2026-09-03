import { Component, computed, effect, Injector, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@component/shared/inputs/button/button.component';
import { InputTextComponent } from '@component/shared/inputs/input-text/input-text.component';
import { ApiResponse, ErrorMessage } from '@models/data/general.model';
import { StoreRequest } from '@models/data/store-request.model';
import { SessionData } from '@models/security/security-data.model';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { StoreRequestService } from 'src/app/core/services/api/data/store-request/store-request.service';
import { LoadingService } from 'src/app/core/services/utils/loading/loading.service';
import { SessionService } from 'src/app/core/services/utils/session/session.service';
import { WorkingService } from 'src/app/core/services/utils/working/working.service';
import { REGEX_TEXT_DEFAULT } from 'src/app/core/utils/constants/regex.contants';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ReactiveFormsModule, MessageModule, ToastModule, TagModule, InputTextComponent, ButtonComponent],
  templateUrl: './user-profile.component.html',
  providers: [MessageService]
})
export class UserProfileComponent implements OnInit {

  storeRequestForm: FormGroup;

  session: Signal<SessionData | null> = computed(() => this.sessionService.session());

  storeRequests: Signal<StoreRequest[]> = computed(() => this.storeRequestService.storeRequests());
  storeRequestsError: Signal<ErrorMessage | null> = computed(() => this.storeRequestService.storeRequestsError());

  pendingStoreRequests: Signal<StoreRequest[]> = computed(() => this.storeRequestService.pendingStoreRequests());
  pendingStoreRequestsError: Signal<ErrorMessage | null> = computed(() => this.storeRequestService.pendingStoreRequestsError());

  isLoading: Signal<boolean> = computed(() => this.loadingService.loading().length > 0);
  isWorking: Signal<boolean> = computed(() => this.workingService.working().length > 0);

  latestStoreRequest: StoreRequest | undefined = undefined;

  constructor(
    private formBuilder: FormBuilder,
    private injector: Injector,
    private messageService: MessageService,
    private storeRequestService: StoreRequestService,
    private sessionService: SessionService,
    private loadingService: LoadingService,
    private workingService: WorkingService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStoreRequestData();
    this.watchLatestStoreRequest();
  }

  initializeForm() {
    this.storeRequestForm = this.formBuilder.group({
      storeName: ['', [Validators.required, Validators.pattern(REGEX_TEXT_DEFAULT)]],
      storeDescription: ['', [Validators.required, Validators.pattern(REGEX_TEXT_DEFAULT)]]
    });
  }

  loadStoreRequestData() {
    if(this.session()?.role === 'client') {
      this.storeRequestService.findByUserId(this.session()?.userId ?? -1);
    }
    if(this.session()?.role === 'admin') {
      this.storeRequestService.findPending();
    }
  }

  watchLatestStoreRequest() {
    effect(() => {
      const requests = this.storeRequests();
      this.latestStoreRequest = requests.length > 0
        ? requests.reduce((latest, current) => current.id > latest.id ? current : latest)
        : undefined;
    }, { injector: this.injector });
  }

  hasPendingRequest(): boolean {
    return this.latestStoreRequest?.status === 'pending';
  }

  isRejectedRequest(): boolean {
    return this.latestStoreRequest?.status === 'rejected';
  }

  receiveValue(key: string, value: string) {
    this.storeRequestForm.patchValue({ [key]: value });
  }

  validateForm() {
    this.storeRequestForm.markAllAsTouched();
    if(!this.storeRequestForm.valid) return;
    this.createStoreRequest();
  }

  createStoreRequest() {
    const userId = this.session()?.userId ?? -1;
    this.storeRequestService.createRequest(
      this.storeRequestForm.value.storeName,
      this.storeRequestForm.value.storeDescription,
      userId
    ).subscribe({
      next: () => {
        this.storeRequestForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Solicitud enviada', detail: 'Tu solicitud quedó pendiente de revisión.' });
      },
      error: (error: ErrorMessage) => {
        this.messageService.add({ severity: 'error', summary: 'No se pudo enviar la solicitud', detail: error?.detail ?? 'Por favor, intentelo de nuevo más tarde.' });
      }
    });
  }

  approveRequest(storeRequest: StoreRequest) {
    const adminId = this.session()?.userId ?? -1;
    this.storeRequestService.approve(storeRequest.id, adminId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Solicitud aprobada', detail: `La tienda "${storeRequest.storeName}" fue aprobada.` });
      },
      error: (error: ErrorMessage) => {
        this.messageService.add({ severity: 'error', summary: 'No se pudo aprobar', detail: error?.detail ?? 'Por favor, intentelo de nuevo más tarde.' });
      }
    });
  }

  rejectRequest(storeRequest: StoreRequest) {
    const adminId = this.session()?.userId ?? -1;
    this.storeRequestService.reject(storeRequest.id, adminId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'info', summary: 'Solicitud rechazada', detail: `La solicitud de "${storeRequest.storeName}" fue rechazada.` });
      },
      error: (error: ErrorMessage) => {
        this.messageService.add({ severity: 'error', summary: 'No se pudo rechazar', detail: error?.detail ?? 'Por favor, intentelo de nuevo más tarde.' });
      }
    });
  }

}
