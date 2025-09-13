import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from './http.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from './../../../environments/environment';
import { Rol } from '../models/rol';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService extends HttpService {
    private sharingRolObservable: BehaviorSubject<Rol> = 
      new BehaviorSubject<Rol>(this.getEmptyProject());
  
    getEmptyProject(): Rol {
      return {
        id: 0,
        descripcion: '',
        statusId: 1
      };
    }

  constructor(protected http: HttpClient,
    private router: Router,
    private toastrService: ToastrService) {
    super(http);
  }

    get sharing(){
      return this.sharingRolObservable.asObservable();
    }
  
    set sharingData (data: Rol){
      this.sharingRolObservable.next(data);
    }


  getAll() {
      return this.get(environment.apiUrl, '/rol/list');
  }

  resetData(){
    this.sharingRolObservable.next(this.getEmptyProject());
  }


  /**
   * Delete Rol by id
   * @param id 
   */
  async deleteRole(id: number) {
    
    const resp = await firstValueFrom(this.delete(environment.apiUrl, `/rol/${id}`));
    if(resp && resp.msg){
      this.toastrService.success('Role elimando con éxito.');
    }
  }


  /**
* Persists rol data
* @param data 
*/
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/rol', data));
      this.toastrService.success('Rol registrado con éxito.');
      this.router.navigate(['/roles']);
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
      await firstValueFrom(this.put(environment.apiUrl, `/rol/${id}`, data));
      this.resetData(); //// Resetear los valores del observable después de actualizar
      this.toastrService.success('Rol actualizado con éxito.');
      this.router.navigate(['/roles']);
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
