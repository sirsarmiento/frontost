import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Family } from '../../models/Cost/family';

@Injectable({
  providedIn: 'root'
})
export class FamilyService extends HttpService {
  private mockFamilies: Family[] = [
    {
      id: 1,
      codigo: 'LUD',
      nombre: 'Lúdica Educativo',
      subcategories: [
        { id: 1, codigo: 'JUE', nombre: 'Juegos de Mesa' },
        { id: 2, codigo: 'DID', nombre: 'Material Didáctico' }
      ]
    },
    { id: 2, codigo: 'POP', nombre: 'Productos POP', subcategories: [] },
    {
      id: 3,
      codigo: 'ROB',
      nombre: 'Robótica',
      subcategories: [
        { id: 3, codigo: 'KIT', nombre: 'Kits de Robótica' },
        { id: 4, codigo: 'COM', nombre: 'Componentes' }
      ]
    },
    { id: 4, codigo: 'MLD', nombre: 'Molde', subcategories: [] },
    { id: 5, codigo: 'MED', nombre: 'Médico', subcategories: [] },
    { id: 6, codigo: 'ODO', nombre: 'Odontológico', subcategories: [] },
    { id: 7, codigo: 'AUT', nombre: 'Automotriz', subcategories: [] },
    { id: 8, codigo: 'IND', nombre: 'Industrial', subcategories: [] }
  ];

  private sharingObservable: BehaviorSubject<Family> =
    new BehaviorSubject<Family>(this.getEmptyConfig());

  getEmptyConfig(): Family {
    return {
      id: 0,
      codigo: '',
      nombre: '',
      subcategories: []
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
    // Simular respuesta del backend envolviendo la lista en un objeto con "data"
    return of({ data: [...this.mockFamilies] });
  }

  async add(data: Family): Promise<any> {
    const newId = this.mockFamilies.length > 0 ? Math.max(...this.mockFamilies.map(f => f.id || 0)) + 1 : 1;
    const newFamily = { ...data, id: newId, codigo: data.codigo.toUpperCase() };
    this.mockFamilies.push(newFamily);
    return of({ success: true }).toPromise();
  }

  async update(id: number, data: Family): Promise<any> {
    const index = this.mockFamilies.findIndex(f => f.id === id);
    if (index !== -1) {
      this.mockFamilies[index] = { ...data, id, codigo: data.codigo.toUpperCase() };
    }
    this.resetData();
    return of({ success: true }).toPromise();
  }

  async deleteFamily(id: number): Promise<any> {
    this.mockFamilies = this.mockFamilies.filter(f => f.id !== id);
    return of({ success: true }).toPromise();
  }
}
