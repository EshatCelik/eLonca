import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../core/base.service';

@Injectable({ providedIn: 'root' })
export class StockMovementService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // Get all stock movements/inventory
  getAll(payload?: any): Observable<any[]> {
    const body = payload ?? {};
    return this.post<any>('Stock/GetAll', body).pipe(
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

  // Get stock movement by id
  getById(id: string | number): Observable<any> {
    const body = { id } as any;
    return this.post<any>('StockMovement/GetById', body).pipe(
      map((res: any) => {
        if (res && typeof res === 'object' && 'isSuccess' in res && res.isSuccess === false) {
          throw new Error(res?.message || 'İstek başarısız');
        }
        return res?.data || res;
      })
    );
  }

  // Get stock movements for specific product and store
  getProductMovements(payload: any): Observable<any[]> {
    const body = payload ?? {};
    return this.post<any>('Stock/GetProductMovements', body).pipe(
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

  // Create stock movement
  create(payload: any): Observable<any> {
    return this.post<any>('Stock/Create', payload);
  }

  // Update stock movement
  update(id: string | number, payload: any): Observable<any> {
    const body = { id, ...payload } as any;
    return this.post<any>('StockMovement/Update', body);
  }

  // Update stock quantity
  updateStock(stockData: any): Observable<any> {
    const body = { ...stockData } as any;
    return this.post<any>('Stock/Update', body);
  }

  // Delete stock movement
  override delete(id: string | number): Observable<any> {
    const body = { id } as any;
    return this.post<any>('StockMovement/Delete', body);
  }

  // Get available products for stock management
  getAvailableProducts(payload?: any): Observable<any[]> {
    const body = payload ?? {};
    return this.post<any>('StockMovement/GetAvailableProducts', body).pipe(
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

  // Get stock history for a product
  getStockHistory(productId: string | number, payload?: any): Observable<any[]> {
    const body = { productId, ...payload } as any;
    return this.post<any>('StockMovement/GetStockHistory', body).pipe(
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
}
