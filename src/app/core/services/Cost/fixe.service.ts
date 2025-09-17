import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Fixe } from '../../models/Cost/fixe';



@Injectable({
  providedIn: 'root'
})
export class FixeService extends HttpService {
  private sharingObservable: BehaviorSubject<Fixe> = 
    new BehaviorSubject<Fixe>(this.getEmptyConfig());

  getEmptyConfig(): Fixe {
    return {
      id: 0,
      tipo: '',
      concepto: '',
      precio: 0,
      clasificacion: ''
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

  set sharingData (data: Fixe){
    this.sharingObservable.next(data);
  }

  resetData(){
    this.sharingObservable.next(this.getEmptyConfig());
  }

  getAll() {
      return this.get(environment.apiUrl, '/costos');
  }

  /**
   * Persists Project data
   * @param data 
   */
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/costo', data));
      this.toastrService.success('Costo registrado con éxito.');
      this.router.navigate(['/Fixes']);
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
      await firstValueFrom(this.put(environment.apiUrl, `/costo/${id}`, data));
      this.resetData(); //// Resetear los valores del observable después de actualizar
      this.toastrService.success('Perfil actualizado con éxito.');
      this.router.navigate(['/Fixes']);
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
