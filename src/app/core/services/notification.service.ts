import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginationResponse } from '../models/pagination-response';
import { environment } from '../../../environments/environment';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { NotificationModel } from '../models/notification';
import TimeAgo from 'javascript-time-ago'

// Spanish.
import es from 'javascript-time-ago/locale/es'
import { ToastrService } from 'ngx-toastr';

TimeAgo.addDefaultLocale(es)

//import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends HttpService {
  environment = environment;
  showNotification$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  notificationsWithoutreading: BehaviorSubject<PaginationResponse> = new BehaviorSubject<PaginationResponse>(null)

  constructor(protected http: HttpClient,
    //private socket: Socket,
    private toastrService: ToastrService,
    private authService: AuthService) {
    super(http);

    // /** Subscribe to connected_user event sent from server */
    // socket.fromEvent('connected_user').subscribe((message: any) => {
    //   console.log('notificacion', message)
    // });

    // /** Subscribe to new_message event sent from server */
    // socket.fromEvent('new_message').subscribe((message: any) => {
    //   console.log('handle new_message event')
    //   console.log('notificacion', message);
    //   this.changeStatusNotification(true);
    //   const user = this.authService.currentUser;
    //   this.getNotificationsWithoutreadingPaginated({ page: environment.paginator.default_page, rowByPage: environment.paginator.row_per_page, word: null, email:user.email});
    // });

    // socket.fromEvent('disconnect').subscribe(() => {
    //   const user = this.authService.currentUser;
    // });

  }

  /**
   * handle icon display notification
   */
  get showNotification(): Observable<boolean> {
    return this.showNotification$.asObservable();
  }

  /**
 * change icon display notification
 */
  changeStatusNotification(value: boolean) {
    this.showNotification$.next(value)
  }

  /**
   * Send event join at user
   * @param email 
   */
  joinRoom(email: string): void {
    //this.socket.emit('join_user', email);
  }

  /**
   * Send to server change status notification
   * @param email 
   */
  sendChangeStatusNotification(email: string): void {
    //this.socket.emit('change_status_notifications', { email: email, message: null });
  }


  /**
 * Check all notifications, supports pagination and filter
 * @param filter 
 * @returns 
 */
  async getNotificationsPaginated(filter: any): Promise<PaginationResponse> {
    const timeAgo = new TimeAgo('es-ES')
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/notification/all/pagined', filter));
    const paginator = new PaginationResponse(filter.page, filter.rowByPage);
    paginator.count = resp.body.count;
    paginator.data = resp.body.data.map((item: any) => {
      const notification = new NotificationModel();
      notification.id = item.id;
      notification.message = item.message;
      notification.notificationDate = item.created_at;
      notification.notificationDateStr = timeAgo.format(new Date(item.created_at))
      return notification;
    })
    return paginator;
  }


  /**
* Check all notifications, supports pagination and filter
* @param filter 
* @returns 
*/
  async getNotificationsWithoutreadingPaginated(filter: any): Promise<PaginationResponse> {
    const timeAgo = new TimeAgo('es-ES')
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/notification/all/pagined_withoutreading', filter));
    const paginator = new PaginationResponse(filter.page, filter.rowByPage);
    paginator.count = resp.body.count;
    paginator.data = resp.body.data.map((item: any) => {
      const notification = new NotificationModel();
      notification.id = item.id;
      notification.message = item.message;
      notification.notificationDate = item.created_at;
      notification.notificationDateStr = timeAgo.format(new Date(item.created_at))
      return notification;
    })
    this.setNotificationsWithoutreading(paginator);
    return paginator;
  }

  setNotificationsWithoutreading(noti:PaginationResponse){
    this.notificationsWithoutreading.next(noti)
  }


  getNotificationsWithoutreading():Observable<PaginationResponse>{
    return this.notificationsWithoutreading.asObservable()
  }

  /**
   * Delete notification by id
   * @param id 
   */
  async deleteNotificationById(id: number) {
    const resp = await firstValueFrom(this.delete(environment.apiUrl, `/notification/deleteNotificacion/${id}`));
    if (resp.statusCode == 200) {
      this.toastrService.success(resp.body)
    } else {
      this.toastrService.error('Ha ocurrido un error eliminando la notificación.')
    }
  }


}
