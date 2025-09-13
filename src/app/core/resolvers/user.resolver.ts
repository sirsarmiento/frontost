import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { SelectOption } from '../models/select-option';

@Injectable({
  providedIn: 'root'
})
export class GetInfoUserResolver implements Resolve<any> {
  constructor(private userService: UserService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return this.userService.getInfoUser();
  }
}


@Injectable({
  providedIn: 'root'
})
export class GetAllUserResolver implements Resolve<any> {
  constructor(private userService: UserService) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let resp = await this.userService.getUsers({ page: 1, rowByPage: 9999, word: null });
    
    let users = resp.map((item: any) => {
      return new SelectOption(item.id, `${item.firstName} ${item.lastName}`);
    });
    return users;
  }
}


@Injectable({
  providedIn: 'root'
})
export class GetMenuOptions implements Resolve<any> {
  constructor(private userService: UserService) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return await this.userService.getAllMenuOptions();
  }
}