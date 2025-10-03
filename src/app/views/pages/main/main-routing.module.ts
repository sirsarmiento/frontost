import { GetMenuOptions } from './../../../core/resolvers/user.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../../core/guard/auth.guard';
import { BaseComponent } from '../../layout/base/base.component';
//import { NotificationResolver } from '../../../core/resolvers/notification.resolver';

const routes: Routes = [
  { path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    resolve:{
      options: GetMenuOptions,
      //notifications: NotificationResolver
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'password',
        loadChildren: () => import('../password/password.module').then(m => m.PasswordModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('../roles-permissions/roles-permissions.module').then(m => m.RolesPermissionsModule),
      },
      {
        path: 'configs',
        loadChildren: () => import('../cost/configs/configs.module').then(m => m.ConfigsModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../cost/products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'fixes',
        loadChildren: () => import('../cost/fixes/fixes.module').then(m => m.FixesModule)
      },
      {
        path: 'vars',
        loadChildren: () => import('../cost/vars/vars.module').then(m => m.VarsModule)
      },
      {
        path: 'assets',
        loadChildren: () => import('../cost/assets/assets.module').then(m => m.AssetsModule)
      },
      {
        path: 'budgets',
        loadChildren: () => import('../cost/budget/budgets.module').then(m => m.BudgetsModule)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
