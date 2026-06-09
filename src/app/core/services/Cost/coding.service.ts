import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodingService extends HttpService {
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
      subfamilia: ''
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
    return this.get(environment.apiUrl, '/codigos');
  }

  async add(data: any): Promise<any> {
    const { productName, categoria, tecnologia, material, familia, subfamilia, productId, presupuestoId, familiaId, subfamiliaId } = data;

    const basePrefix = `${categoria}-${tecnologia}-${material}-${familia}`;
    const subStr = subfamilia ? subfamilia.toString().toUpperCase() : '';
    const searchStr = subStr ? `${basePrefix}-${subStr}` : `${basePrefix}-`;

    const allResp = await this.getAll().toPromise().catch(() => ({ data: [] }));
    const allCodings = allResp.data || [];

    const matches = allCodings.filter((c: any) => {
      const cSku = c.sku || c.codigo || '';
      if (subStr) {
        return cSku.startsWith(searchStr) && !cSku.startsWith(searchStr + '-');
      }
      return cSku.startsWith(searchStr);
    });

    let nextNum = 1;
    if (matches.length > 0) {
      const lastCodes = matches.map((c: any) => {
        const cSku = c.sku || c.codigo || '';
        const match = cSku.match(/\d+$/);
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

    const payload = {
      categoria: categoria,
      producto: productId || null,
      tecnologia: tecnologia,
      familia: familiaId || null,
      subfamilia: subfamiliaId || null,
      material: material,
      codigo: finalSku,
      catalogo: "CAT-2024",
      productName: productName,
      presupuestoId: presupuestoId,
      familia_codigo: familia,
      subfamilia_codigo: subfamilia
    };

    const resp: any = await this.post(environment.apiUrl, '/codigo', payload).toPromise();
    if (resp && resp.data) {
      resp.data.sku = resp.data.codigo || finalSku;
      return resp;
    }
    return { data: { ...payload, sku: finalSku } };
  }

  async update(id: number, data: any): Promise<any> {
    const { productName, categoria, tecnologia, material, familia, subfamilia, productId, presupuestoId, familiaId, subfamiliaId } = data;

    const basePrefix = `${categoria}-${tecnologia}-${material}-${familia}`;
    const subStr = subfamilia ? subfamilia.toString().toUpperCase() : '';
    const searchStr = subStr ? `${basePrefix}-${subStr}` : `${basePrefix}-`;

    const allResp = await this.getAll().toPromise().catch(() => ({ data: [] }));
    const allCodings = allResp.data || [];

    const matches = allCodings.filter((c: any) => {
      if (c.id === id) return false;
      const cSku = c.sku || c.codigo || '';
      if (subStr) {
        return cSku.startsWith(searchStr) && !cSku.startsWith(searchStr + '-');
      }
      return cSku.startsWith(searchStr);
    });

    let nextNum = 1;
    if (matches.length > 0) {
      const lastCodes = matches.map((c: any) => {
        const cSku = c.sku || c.codigo || '';
        const match = cSku.match(/\d+$/);
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

    const payload = {
      categoria: categoria,
      producto: productId || null,
      tecnologia: tecnologia,
      familia: familiaId || null,
      subfamilia: subfamiliaId || null,
      material: material,
      codigo: finalSku,
      catalogo: "CAT-2024",
      productName: productName,
      presupuestoId: presupuestoId,
      familia_codigo: familia,
      subfamilia_codigo: subfamilia
    };

    const resp: any = await this.put(environment.apiUrl, `/codigo/${id}`, payload).toPromise();
    if (resp && resp.data) {
      resp.data.sku = resp.data.codigo || finalSku;
      return resp;
    }
    return { data: { ...payload, sku: finalSku } };
  }

  async deleteCoding(id: number): Promise<any> {
    return this.delete(environment.apiUrl, `/codigo/${id}`).toPromise();
  }
}
