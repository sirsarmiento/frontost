import { GetMenuOptions } from './../../../core/resolvers/user.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './../../../core/guard/auth.guard';
import { BaseComponent } from '../../layout/base/base.component';
import { RoleGuard } from 'src/app/core/guard/role.guard';
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
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR', 'ROLE_ANALISTA'] }
      },
      {
        path: 'users',
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'password',
        loadChildren: () => import('../password/password.module').then(m => m.PasswordModule),
      },
      {
        path: 'roles',
        loadChildren: () => import('../roles-permissions/roles-permissions.module').then(m => m.RolesPermissionsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'configs',
        loadChildren: () => import('../cost/configs/configs.module').then(m => m.ConfigsModule),
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR'] }
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
        path: 'pricings',
        loadChildren: () => import('../cost/pricings/pricings.module').then(m => m.PricingsModule)
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
