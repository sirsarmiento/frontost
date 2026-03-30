import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CodePreviewModule } from '../../../partials/code-preview/code-preview.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconModule } from '../../../../core/feather-icon/feather-icon.module';
import { SharedModule } from '../../../shared/shared.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { PricingsComponent } from './pricings.component';
import { PricingComponent } from './pricing/pricing.component';

const routes: Routes = [
  {
    path: '',
    component: PricingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'pricing',
        pathMatch: 'full'
      },
      {
        path: 'pricing',
        component: PricingComponent
      },
    ]
  }
]

@NgModule({
  declarations: [ PricingsComponent,  PricingComponent ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CodePreviewModule,
    NgbModule,
    FormsModule,
    FeatherIconModule,
    SharedModule,
    
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class PricingsModule { } 