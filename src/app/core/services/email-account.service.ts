import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Email } from '../models/email';
import { EmailAccount } from '../models/email-account';
import { PaginationResponse } from '../models/pagination-response';
import { SelectOption } from '../models/select-option';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EmailAccountService extends HttpService {

  constructor(protected http: HttpClient,
    private toastrService: ToastrService) {
    super(http);
  }


  /**
 * Check all EmailAccount, supports pagination and filter
 * @param filter 
 * @returns 
 */
  async getEmailAccountsPagined(filter: any): Promise<PaginationResponse> {
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/cuenta/pagined', filter));
    const paginator = new PaginationResponse(filter.page, filter.rowByPage);
    paginator.count = resp.count;
    paginator.data = resp.data.map((item: any) => {
        const account = new EmailAccount();
        account.id = item.id;
        account.accountName = item.nombre;
        account.type = new SelectOption(item.tipoCuenta.id, item.tipoCuenta.tipo);
        account.status = new SelectOption(item.status.id, item.status.nombre);
        account.email = item.email;
        account.password = item.password;
        return account;
    });
    console.log(paginator.data)
    return paginator;
  }

  /**
* Query EmailAccount by id
* @param id 
* @returns 
*/
  async getEmailAccountById(id: number): Promise<EmailAccount> {
    const resp = await firstValueFrom(this.get(environment.apiUrl, `/cuenta/${id}`));
    const account = new EmailAccount();
        account.id = resp[0].id;
        account.accountName = resp[0].nombre;
        account.type = new SelectOption(resp[0].tipoCuenta.id, resp[0].tipoCuenta.nombre);
        account.status = new SelectOption(resp[0].status.id, resp[0].status.nombre);
        account.email = resp[0].email;
        account.password = resp[0].password;
        return account;
    return account;
  }

  /**
* Persists authorization data
* @param data 
*/
  async storeEmailAccount(data: any) {
    try {
      if (data.id) {
        const id = data.id;
        delete data.id;
        await firstValueFrom(this.put(environment.apiUrl, `/cuenta/${id}`, data));
        this.toastrService.success('Cuenta de email actualizado con éxito.');
      } else {
        await firstValueFrom(this.post(environment.apiUrl, '/cuenta', data));
        this.toastrService.success('Cuenta de email registrada con éxito.');
      }
    } catch (error: any) {

      console.log(error);
      if (error.status == 409) {
        this.toastrService.error('', 'El email ya ha sido registrado.');
      }
      if (error.status != 500 && error.status != 409) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }

    }
  }

  /**
 * Delete account by id
 * @param id 
 */
  async deleteAccount(id: number) {

    const resp = await firstValueFrom(this.delete(environment.apiUrl, `/cuenta/${id}`));
    if (resp && resp.msg) {
      this.toastrService.success('Cuenta de email elimanda con éxito.');
    }
  }



  /**
   * list all mailboxes, supports pagination and filter
   * @param filter 
   * @returns 
   */
    async getMailboxesPagined(filter: any): Promise<PaginationResponse> {
      const resp = await firstValueFrom(this.get(environment.apiUrl, '/imap/check/mailboxe'));
      const paginator = new PaginationResponse(filter.page, filter.rowByPage);
      paginator.count = resp.count;
      paginator.data = resp.map((item: any) => {
          const account = new EmailAccount();
          account.id = item.id;
          account.accountName = item.nombre;
          account.quantityUnreadEmails = item.infoBuzon.Unread;
          return account;
      });
      console.log(paginator.data)
      return paginator;
    }


  /**
   * list all mailboxes, supports pagination and filter
   * @param filter 
   * @returns 
   */
  async getMailboxeHeaderByIdPagined(filter: any): Promise<PaginationResponse> {
    const resp = await firstValueFrom(this.post(environment.apiUrl, '/imap/mailboxes/mail/pagined', filter));
    const paginator = new PaginationResponse(filter.page, filter.rowByPage);
    paginator.count = resp.total;
    paginator.data = resp.data.map((item: any) => {

      const email = new Email();
      email.subject = item.subject;
      email.from = item.from;
      email.to = item.to;
      email.size = item.size;
      email.date = item.date;
      email.uid = item.uid;
        return email;

    });

    return paginator;
  }

}
