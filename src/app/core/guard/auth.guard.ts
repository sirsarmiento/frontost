import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    const currentUser = this.authService.currentUser;
    
    if (!currentUser) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    const userRoles = currentUser.roles;

    console.log(userRoles);
    //const url = state.url;
    // ADMINISTRADOR tiene acceso a todo
    if (userRoles.includes('ROLE_ANALISTA') || userRoles.includes('ROLE_ADMINISTRADOR')) {
      return true;
    }
  }
}