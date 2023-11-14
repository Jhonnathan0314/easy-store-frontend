import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PrimengModule } from './primeng.module';

import { InputTextComponent } from './inputs/input-text/input-text.component';
import { InputNumberComponent } from './inputs/input-number/input-number.component';
import { InputDateComponent } from './inputs/input-date/input-date.component';
import { InputTextAreaComponent } from './inputs/input-text-area/input-text-area.component';
import { InputDropdownComponent } from './inputs/input-dropdown/input-dropdown.component';
import { InputMultiselectComponent } from './inputs/input-multiselect/input-multiselect.component';
import { InputPasswordComponent } from './inputs/input-password/input-password.component';
import { ButtonComponent } from './inputs/button/button.component';
import { InputGroupTextComponent } from './inputs/input-group-text/input-group-text.component';
import { InputMaskComponent } from './inputs/input-mask/input-mask.component';
import { InputRatingComponent } from './inputs/input-rating/input-rating.component';
import { ConfirmDialogComponent } from './inputs/confirm-dialog/confirm-dialog.component';

import { SplitButtonComponent } from './menus/split-button/split-button.component';
import { TabMenuComponent } from './menus/tab-menu/tab-menu.component';
import { MenuBarComponent } from './menus/menu-bar/menu-bar.component';
import { DataViewComponent } from './menus/data-view/data-view.component';
import { DataViewLayoutOptions } from 'primeng/dataview';
import { FiltersMenuComponent } from './menus/filters-menu/filters-menu.component';

import { MessageComponent } from './informative/message/message.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputDateComponent,
    InputDropdownComponent,
    InputGroupTextComponent,
    InputMaskComponent,
    InputMultiselectComponent,
    InputNumberComponent,
    InputPasswordComponent,
    InputRatingComponent,
    InputTextComponent,
    InputTextAreaComponent,
    ConfirmDialogComponent,

    SplitButtonComponent,
    TabMenuComponent,
    MenuBarComponent,
    DataViewComponent,
    FiltersMenuComponent,

    MessageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
        PrimengModule
  ],
  exports: [
    ButtonComponent,
    InputDateComponent,
    InputDropdownComponent,
    InputGroupTextComponent,
    InputMaskComponent,
    InputMultiselectComponent,
    InputNumberComponent,
    InputPasswordComponent,
    InputRatingComponent,
    InputTextComponent,
    InputTextAreaComponent,
    ConfirmDialogComponent,
    
    SplitButtonComponent,
    TabMenuComponent,
    MenuBarComponent,
    DataViewComponent,
    FiltersMenuComponent,

    MessageComponent
  ],
  bootstrap: [ DataViewLayoutOptions ]
})
export class SharedModule { }
