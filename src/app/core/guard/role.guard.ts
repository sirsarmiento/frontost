import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.currentUser;
    
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.checkUserAccess(currentUser.roles, route);
  }

  private checkUserAccess(roles: string[], route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as Array<string>;
    
    if (!expectedRoles) {
      return true; // Si no hay roles definidos, permitir acceso
    }
    
    return expectedRoles.some(role => roles.includes(role));
  }
}