import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { TabMenuModule } from 'primeng/tabmenu';
import { MenubarModule } from 'primeng/menubar';
import { DataViewModule } from 'primeng/dataview';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MessagesModule } from 'primeng/messages';

import { CarouselModule } from 'primeng/carousel';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,

    ButtonModule,
    SplitButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    MultiSelectModule,
    InputNumberModule,
    PasswordModule,
    RatingModule,
    InputTextareaModule,
    AutoCompleteModule,

    DividerModule,
    TagModule,

    TabMenuModule,
    MenubarModule,
    DataViewModule,

    ConfirmDialogModule,
    ConfirmPopupModule,
    ToastModule,
    MessagesModule,

    CarouselModule
  ],
  exports: [
    ButtonModule,
    SplitButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    MultiSelectModule,
    InputNumberModule,
    PasswordModule,
    RatingModule,
    InputTextareaModule,
    AutoCompleteModule,
    
    DividerModule,
    TagModule,

    TabMenuModule,
    MenubarModule,
    DataViewModule,
    
    ConfirmDialogModule,
    ConfirmPopupModule,
    ToastModule,
    MessagesModule,

    CarouselModule
  ]
})
export class PrimengModule { }
