import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FrecuenceService extends HttpService {

  constructor(protected http: HttpClient,
    private toastrService: ToastrService,
    ) {
    super(http);
  }

  getAll() {
      return this.get(environment.apiUrl, '/frecuencia');
  }

  /**
   * Persists Project data
   * @param data 
   */
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/frecuencia', data));
      this.toastrService.success('Frecuencia registrado con exito.');
    } catch (error: any) {        
      if (error.status == 409) {
        this.toastrService.error('', error.error.msg);
      }
      if (error.status != 500 && error.status != 409) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }
  }

  async update(id: number, data: any) {
    try {
      await firstValueFrom(this.put(environment.apiUrl, `/frecuencia/actualizar/${id}`, data));
      this.toastrService.success('Frecuencia actualizado con exito.')
    } catch (error: any) {
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }

  }
}
