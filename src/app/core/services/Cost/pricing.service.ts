import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricingService extends HttpService {
  constructor(protected http: HttpClient) {
    super(http);
  }

}