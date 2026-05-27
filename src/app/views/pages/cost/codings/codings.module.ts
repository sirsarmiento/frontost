import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CodingsComponent } from './codings.component';
import { CodingComponent } from './coding/coding.component';
import { AddCodingComponent } from './add-coding/add-coding.component';
import { AddFamilyComponent } from './add-family/add-family.component';
import { SharedModule } from '../../../shared/shared.module';
import { FeatherIconModule } from '../../../../core/feather-icon/feather-icon.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: CodingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'coding',
        pathMatch: 'full'
      },
      {
        path: 'coding',
        component: CodingComponent
      },
      {
        path: 'add-coding',
        component: AddCodingComponent
      },
      {
        path: 'add-family',
        component: AddFamilyComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    CodingsComponent,
    CodingComponent,
    AddCodingComponent,
    AddFamilyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FeatherIconModule,
    NgbModule
  ]
})
export class CodingsModule { }
