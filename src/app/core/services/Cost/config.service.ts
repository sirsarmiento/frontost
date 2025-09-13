import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Config } from '../../models/Cost/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService extends HttpService {
  private sharingObservable: BehaviorSubject<Config> = 
    new BehaviorSubject<Config>(this.getEmptyConfig());

  getEmptyConfig(): Config {
    return {
      id: 0,
      nombre: '',
      tipo: '',
      sector: '',
      empleados: 0,
      rif: '',
      periodo: '',
      direccion: '',
      moneda: '',
    };

  }

  constructor(protected http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    ) {
    super(http);
  }

  get sharingProject(){
    return this.sharingObservable.asObservable();
  }

  set sharingData (data: Config){
    this.sharingObservable.next(data);
  }

  resetData(){
    this.sharingObservable.next(this.getEmptyConfig());
  }

  getAll() {
      return this.get(environment.apiUrl, '/configs');
  }

  /**
   * Persists Project data
   * @param data 
   */
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/config', data));
      this.toastrService.success('Configuración registrada con éxito.');
      this.router.navigate(['/configs']);
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
      await firstValueFrom(this.put(environment.apiUrl, `/config/actualizar/${id}`, data));
      this.resetData(); //// Resetear los valores del observable después de actualizar
      this.toastrService.success('Configuración actualizada con éxito.');
      this.router.navigate(['/configs']);
    } catch (error: any) {
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }
  }

  async deleteUser(id: number, userId: number) {
    try {
      await firstValueFrom(this.delete(environment.apiUrl, `/config/${id}/remove-user/${userId}`));
      this.toastrService.success('Responsable eliminado con éxito.');
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
