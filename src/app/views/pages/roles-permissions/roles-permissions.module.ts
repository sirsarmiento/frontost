import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesPermissionsComponent } from './roles-permissions.component';
import { Routes, RouterModule } from '@angular/router';
import { CodePreviewModule } from '../../partials/code-preview/code-preview.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { FeatherIconModule } from '../../../core/feather-icon/feather-icon.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RolStoreComponent } from './rol-store/rol-store.component';
import { RolesComponent } from './roles/roles.component';
import { SharedModule } from '../../shared/shared.module';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


const routes: Routes = [
  {
    path: '',
    component: RolesPermissionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'rol',
        pathMatch: 'full'
      },
      {
        path: 'rol',
        component: RolesComponent
      },
      {
        path: 'add-rol',
        component: RolStoreComponent
      },
    ]
  }
]

@NgModule({
  declarations: [RolesPermissionsComponent, RolesComponent, RolStoreComponent],
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
export class RolesPermissionsModule { }
