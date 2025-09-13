import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MainRoutingModule,
    NgSelectModule,
    NgxPermissionsModule.forChild()
  ]
})
export class MainModule { }
