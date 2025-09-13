import { UserService } from '../services/user.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { NotificationService } from '../services/notification.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationResolver implements Resolve<any> {
  environment = environment;
  constructor(private notificationService: NotificationService,
    private authService:AuthService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    const user = this.authService.currentUser;
    return this.notificationService.getNotificationsWithoutreadingPaginated({ page: environment.paginator.default_page, rowByPage: environment.paginator.row_per_page, word: null, email:user.email});
  }
}
