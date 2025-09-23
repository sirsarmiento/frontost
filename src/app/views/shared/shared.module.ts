import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseComponent } from './components/base/base.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesModule } from 'angular-datatables';
// Angular material modules
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSliderModule } from '@angular/material/slider';
import { ModalResponsibleComponent } from './components/modal-responsible/modal-responsible.component';
import { ModalGenericComponent } from './components/modal-generic/modal-generic.component';
import { ModalRiskComponent } from './components/modal-risk/modal-risk.component';
import { ModalImpactComponent } from './components/modal-impact/modal-impact.component';
import { ModalWeightsComponent } from './components/modal-weights/modal-weights.component';
import { ModalSolidityComponent } from './components/modal-solidity/modal-solidity.component';
import { ColorPickerModule } from 'ngx-color-picker';

import { CurrencyMaskConfig, CurrencyMaskModule, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: true,
  decimal: ",",
  precision: 2,
  prefix: "$",
  suffix: "",
  thousands: "."
};

@NgModule({
  declarations: [BaseComponent, ModalResponsibleComponent, ModalGenericComponent, ModalRiskComponent, ModalImpactComponent, ModalWeightsComponent, ModalSolidityComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDatatableModule,
    DataTablesModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSliderModule,
    ColorPickerModule,
      CurrencyMaskModule,
  ],
  exports:[
    FormsModule,
    ReactiveFormsModule,
    BaseComponent,
    ModalResponsibleComponent,
    ModalRiskComponent,
    ModalGenericComponent,
    ModalImpactComponent,
    NgxDatatableModule,
    DataTablesModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSliderModule,
    ColorPickerModule,
    CurrencyMaskModule,
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
})
export class SharedModule { }
