import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StructureService extends HttpService {

  constructor(protected http: HttpClient,
    ) {
    super(http);
  }


  getAll() {
      return this.get(environment.apiUrl, '/estructuraorganizativa/list');
  }

  getById(id: number) {
      return this.get(environment.apiUrl, `/estructuraorganizativa/listid/${id}`);
  }
}
