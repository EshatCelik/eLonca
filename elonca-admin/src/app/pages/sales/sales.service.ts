import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../core/base.service';

@Injectable({ providedIn: 'root' })
export class SalesService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  getAll(payload?: any): Observable<any[]> {
    const body = payload ?? {};
    return this.post<any>('Sale/GetAll', body).pipe(
      map((res: any) => {
        if (res && typeof res === 'object' && 'isSuccess' in res && res.isSuccess === false) {
          throw new Error(res?.message || 'İstek başarısız');
        }
        let list: any = null;
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.items)) list = res.items;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.result)) list = res.result;
        else if (Array.isArray(res?.value)) list = res.value;
        else if (Array.isArray(res?.result?.data)) list = res.result.data;
        else if (Array.isArray(res?.result?.value)) list = res.result.value;
        return Array.isArray(list) ? list : [];
      })
    );
  }
  getAllCustomerSale(payload?: any): Observable<any[]> {
    const body = payload ?? {};
    return this.post<any>('Sale/GetAllCustomerSale', body).pipe(
      map((res: any) => {
        if (res && typeof res === 'object' && 'isSuccess' in res && res.isSuccess === false) {
          throw new Error(res?.message || 'İstek başarısız');
        }
        let list: any = null;
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.items)) list = res.items;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.result)) list = res.result;
        else if (Array.isArray(res?.value)) list = res.value;
        else if (Array.isArray(res?.result?.data)) list = res.result.data;
        else if (Array.isArray(res?.result?.value)) list = res.result.value;
        return Array.isArray(list) ? list : [];
      })
    );
  }

  create(payload: any): Observable<any> {
    return this.post<any>('Sale/Create', payload);
  }

  getById(id: string | number): Observable<any> {
    const body = { id };
    return this.post<any>('Sale/GetById', body);
  }

  update(id: string | number, payload: any): Observable<any> {
    const body = { id, ...payload };
    return this.post<any>('Sale/Update', body);
  }

  createSaleItem(saleId: string, payload: any): Observable<any> {
    const body = { saleId, ...payload };
    return this.post<any>('SaleItem/Create', body);
  }

  updateSaleItem(id: string, payload: any): Observable<any> {
    const body = { id, ...payload };
    return this.post<any>('SaleItem/Update', body);
  }

  deleteSaleItem(id: string): Observable<any> {
    const body = { id };
    return this.post<any>('SaleItem/Delete', body);
  }

  override delete(id: string | number): Observable<any> {
    const body = { id } as any;
    return this.post<any>('Sale/Delete', body);
  }
}
