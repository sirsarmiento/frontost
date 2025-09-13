import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';


const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  { path:'', loadChildren: () => import('./views/pages/main/main.module').then(m => m.MainModule) },
  //{ path:'', loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { 
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', onSameUrlNavigation: 'reload'})], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
