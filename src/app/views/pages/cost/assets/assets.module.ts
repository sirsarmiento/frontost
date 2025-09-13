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
import { AssetsComponent } from './assets.component';
import { AssetComponent } from './asset/asset.component';
import { AddAssetComponent } from './add-asset/add-asset.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


const routes: Routes = [
  {
    path: '',
    component: AssetsComponent,
    children: [
      {
        path: '',
        redirectTo: 'asset',
        pathMatch: 'full'
      },
      {
        path: 'asset',
        component: AssetComponent
      },
      {
        path: 'add-asset',
        component: AddAssetComponent
      },
    ]
  }
]

@NgModule({
  declarations: [AssetsComponent, AssetComponent, AddAssetComponent],
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
export class AssetsModule { }
