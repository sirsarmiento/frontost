import { CompanyService } from './../services/company.service';
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
export class GetAllCompanyResolver implements Resolve<any> {
  constructor(private companyService: CompanyService) { }
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    let resp = await this.companyService.getCompanies();
    
    let companies = resp.map((item: any) => {
      return new SelectOption(item.id, `${item.name}`);
    });
    return companies;
  }
}