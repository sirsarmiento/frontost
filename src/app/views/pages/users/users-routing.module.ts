import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { AddUserComponent } from './components/add-user/add-user.component';

const routes: Routes = [
  {
    path:'',
    component:UsersComponent,
    data:{
      title: 'Usuarios',
    }
  },
  {
    path: 'add-user',
    component: AddUserComponent,
    data: {
      title: 'Crear Usuario',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
