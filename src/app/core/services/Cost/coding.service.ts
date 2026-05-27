import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodingService extends HttpService {
  private mockCodifications: any[] = [
    { id: 1, sku: 'PF-FDM-PLA-LUD-JUE001', productName: 'Tetris Balance', categoria: 'PF', tecnologia: 'FDM', material: 'PLA', familia: 'LUD', subcategoria: 'JUE', fecha: new Date('2026-05-10') },
    { id: 2, sku: 'PF-FDM-PLA-LUD-DID002', productName: 'Isla de Pascua', categoria: 'PF', tecnologia: 'FDM', material: 'PLA', familia: 'LUD', subcategoria: 'DID', fecha: new Date('2026-05-12') },
    { id: 3, sku: 'SR-SLA-RES-LUD-JUES01', productName: 'Servicio de Escaneo 3D', categoria: 'SR', tecnologia: 'SLA', material: 'RES', familia: 'LUD', subcategoria: 'JUE', fecha: new Date('2026-05-15') },
    { id: 4, sku: 'PP-FDM-ABS-LUD-P01', productName: 'Proyecto Robot Didáctico', categoria: 'PP', tecnologia: 'FDM', material: 'ABS', familia: 'LUD', subcategoria: '', fecha: new Date('2026-05-18') }
  ];

  private sharingObservable: BehaviorSubject<any> = new BehaviorSubject<any>(this.getEmptyConfig());

  getEmptyConfig(): any {
    return {
      id: 0,
      sku: '',
      productName: '',
      categoria: '',
      tecnologia: '',
      material: '',
      familia: '',
      subcategoria: ''
    };
  }

  constructor(protected http: HttpClient) {
    super(http);
  }

  get sharingProject() {
    return this.sharingObservable.asObservable();
  }

  set sharingData(data: any) {
    this.sharingObservable.next(data);
  }

  resetData() {
    this.sharingObservable.next(this.getEmptyConfig());
  }

  getAll(): Observable<any> {
    return of({ data: [...this.mockCodifications] });
  }

  async add(data: any): Promise<any> {
    const { productName, categoria, tecnologia, material, familia, subcategoria } = data;

    const basePrefix = `${categoria}-${tecnologia}-${material}-${familia}`;
    const subStr = subcategoria ? subcategoria.toUpperCase() : '';

    // El prefijo para buscar correlativos incluye la subcategoría si existe
    const searchStr = subStr ? `${basePrefix}-${subStr}` : `${basePrefix}-`;

    const matches = this.mockCodifications.filter(c => {
      if (subStr) {
        // Asegurarnos que no tenga guión después de la subcategoría
        return c.sku.startsWith(searchStr) && !c.sku.startsWith(searchStr + '-');
      }
      return c.sku.startsWith(searchStr);
    });

    let nextNum = 1;
    if (matches.length > 0) {
      const lastCodes = matches.map(c => {
        const match = c.sku.match(/\d+$/);
        return match ? parseInt(match[0], 10) : 0;
      });
      nextNum = Math.max(...lastCodes) + 1;
    }

    // Formatea el correlativo
    let correlativo = '';
    if (categoria === 'SR') {
      correlativo = `S${nextNum.toString().padStart(2, '0')}`;
    } else if (categoria === 'PP') {
      correlativo = `P${nextNum.toString().padStart(2, '0')}`;
    } else {
      correlativo = nextNum.toString().padStart(3, '0');
    }

    // Crea el código completo
    const finalSku = subStr ? `${basePrefix}-${subStr}${correlativo}` : `${basePrefix}-${correlativo}`;

    // Agregar a la lista mock
    const newCod = {
      id: this.mockCodifications.length + 1,
      sku: finalSku,
      productName: productName,
      categoria,
      tecnologia,
      material,
      familia,
      subcategoria: subcategoria || '',
      fecha: new Date()
    };
    this.mockCodifications.push(newCod);

    return of({ success: true, data: newCod }).toPromise();
  }

  async update(id: number, data: any): Promise<any> {
    const index = this.mockCodifications.findIndex(c => c.id === id);
    if (index !== -1) {
      // Recalcular el SKU en base a los nuevos datos
      const { categoria, tecnologia, material, familia, subcategoria } = data;
      const basePrefix = `${categoria}-${tecnologia}-${material}-${familia}`;
      const subStr = subcategoria ? subcategoria.toUpperCase() : '';
      const searchStr = subStr ? `${basePrefix}-${subStr}` : `${basePrefix}-`;

      const matches = this.mockCodifications.filter(c => {
        if (c.id === id) return false;
        if (subStr) {
          return c.sku.startsWith(searchStr) && !c.sku.startsWith(searchStr + '-');
        }
        return c.sku.startsWith(searchStr);
      });

      let nextNum = 1;
      if (matches.length > 0) {
        const lastCodes = matches.map(c => {
          const match = c.sku.match(/\d+$/);
          return match ? parseInt(match[0], 10) : 0;
        });
        nextNum = Math.max(...lastCodes) + 1;
      }

      let correlativo = '';
      if (categoria === 'SR') {
        correlativo = `S${nextNum.toString().padStart(2, '0')}`;
      } else if (categoria === 'PP') {
        correlativo = `P${nextNum.toString().padStart(2, '0')}`;
      } else {
        correlativo = nextNum.toString().padStart(3, '0');
      }

      const finalSku = subStr ? `${basePrefix}-${subStr}${correlativo}` : `${basePrefix}-${correlativo}`;

      this.mockCodifications[index] = {
        ...this.mockCodifications[index],
        ...data,
        sku: finalSku
      };
      return of({ success: true, data: this.mockCodifications[index] }).toPromise();
    }
    throw new Error('Código no encontrado');
  }

  async deleteCoding(id: number): Promise<any> {
    const index = this.mockCodifications.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCodifications.splice(index, 1);
      return of({ success: true }).toPromise();
    }
    throw new Error('Código no encontrado');
  }
}
