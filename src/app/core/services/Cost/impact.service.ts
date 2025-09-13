import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpactService extends HttpService {

  constructor(protected http: HttpClient,
    private toastrService: ToastrService,
    ) {
    super(http);
  }

  getAll() {
      return this.get(environment.apiUrl, '/impacto');
  }
  
  /**
   * Persists Project data
   * @param data 
   */
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/impacto', data));
      this.toastrService.success('Impacto registrado con exito.');
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
      await firstValueFrom(this.put(environment.apiUrl, `/impacto/actualizar/${id}`, data));
      this.toastrService.success('Impacto actualizado con exito.')
    } catch (error: any) {
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }
  }

  /**
   * Mapa de calor
   */
  getMapaCalor() {
    return this.get(environment.apiUrl, '/mapacalor');
  }  

  async updateMapaCalor(id: number, data: any) {
    try {
      await firstValueFrom(this.put(environment.apiUrl, `/mapacalor/actualizar/${id}`, data));
      this.toastrService.success('Mapa de calor actualizado con exito.')
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
