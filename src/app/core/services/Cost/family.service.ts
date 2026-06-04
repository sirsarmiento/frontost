import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { Family } from '../../models/Cost/family';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends HttpService {


  private sharingObservable: BehaviorSubject<Family> =
    new BehaviorSubject<Family>(this.getEmptyConfig());

  getEmptyConfig(): Family {
    return {
      id: 0,
      codigo: '',
      nombre: '',
      subFamilias: []
    };
  }

  constructor(protected http: HttpClient) {
    super(http);
  }

  get sharingProject() {
    return this.sharingObservable.asObservable();
  }

  set sharingData(data: Family) {
    this.sharingObservable.next(data);
  }

  resetData() {
    this.sharingObservable.next(this.getEmptyConfig());
  }

  getAll(): Observable<any> {
    return this.get(environment.apiUrl, '/familia');
  }

  async add(data: any): Promise<any> {
    // Asegurar estructura esperada por el backend
    const payload = {
      codigo: data.codigo,
      nombre: data.nombre,
      empresaId: 1,
      createBy: 'admin',
      subFamilias: data.subFamilias || []
    };
    return firstValueFrom(this.post(environment.apiUrl, '/familia', payload));
  }

  async update(id: number, data: any): Promise<any> {
    const payload = {
      codigo: data.codigo,
      nombre: data.nombre,
      empresaId: 1,
      createBy: 'admin',
      subFamilias: data.subFamilias || []
    };
    const response = await firstValueFrom(this.put(environment.apiUrl, `/familia/${id}`, payload));
    this.resetData();
    return response;
  }

  async deleteFamily(id: number): Promise<any> {
    return firstValueFrom(this.delete(environment.apiUrl, `/familia/${id}`));
  }
}
