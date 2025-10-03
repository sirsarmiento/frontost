import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Config } from '../../models/Cost/config';
import { BudgetComponent } from 'src/app/views/pages/cost/budget/budget/budget.component';
import { Budget } from '../../models/Cost/budge';

@Injectable({
  providedIn: 'root'
})
export class BudgetService extends HttpService {
  private sharingObservable: BehaviorSubject<Budget> = 
    new BehaviorSubject<Budget>(this.getEmptyBudget());

  getEmptyBudget(): Budget {
    return {
      id: 0,
      clasificacion: '',
      descripcion: '',
      numero: '',
      fecha: new Date(),
      piezas: [],
    };
  }

  constructor(protected http: HttpClient,
    private toastrService: ToastrService,
    private router: Router,
    ) {
    super(http);
  }

  get sharing(){
    return this.sharingObservable.asObservable();
  }

  set sharingData (data: Budget){
    this.sharingObservable.next(data);
  }

  resetData(){
    this.sharingObservable.next(this.getEmptyBudget());
  }

  getAll() {
      return this.get(environment.apiUrl, '/presupuestos');
  }

  /**
   * Persists  data
   * @param data 
   */
  async add(data: any) {
    try {
      await firstValueFrom(this.post(environment.apiUrl, '/presupuesto', data));
      this.toastrService.success('Presupuesto registrado con éxito.');
      this.router.navigate(['/budgets']);
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
      await firstValueFrom(this.put(environment.apiUrl, `/presupuesto/${id}`, data));
      this.resetData(); //// Resetear los valores del observable después de actualizar
      this.toastrService.success('Presupuesto actualizado con éxito.');
      this.router.navigate(['/budgets']);
    } catch (error: any) {
      if (error.status == 409) {
        this.toastrService.error('', error.msg);
      }
      if (error.status != 500) {
        this.toastrService.error('', 'Ha ocurrido un error. Intente más tarde.');
      }
    }
  }

  async deleteBudge(id: number) {
    try {
      await firstValueFrom(this.delete(environment.apiUrl, `/presupuesto/${id}`));
      this.toastrService.success('Presupuesto eliminado con éxito.');
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
