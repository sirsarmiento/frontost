import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CodePreviewModule } from '../../../partials/code-preview/code-preview.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from '../../../../core/feather-icon/feather-icon.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { VarsComponent } from './vars.component';
import { VarComponent } from './var/var.component';
import { AddVarComponent } from './add-var/add-var.component';



const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


const routes: Routes = [
  {
    path: '',
    component: VarsComponent,
    children: [
      {
        path: '',
        redirectTo: 'var',
        pathMatch: 'full'
      },
      {
        path: 'var',
        component: VarComponent
      },
      {
        path: 'add-var',
        component: AddVarComponent
      },
    ]
  }
]

@NgModule({
  declarations: [VarsComponent, VarComponent, AddVarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CodePreviewModule,
    NgbModule,
    PerfectScrollbarModule,
    FormsModule,
    FeatherIconModule,
    SharedModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class VarsModule { }
