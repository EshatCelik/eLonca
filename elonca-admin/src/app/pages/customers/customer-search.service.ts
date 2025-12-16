import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseService } from '../../core/base.service';

@Injectable({ providedIn: 'root' })
export class CustomerSearchService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  searchByName(storeName: string): Observable<any[]> {
    const body = { storeName } as any;
    return this.post<any>('Customer/SearchByName', body).pipe(
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

  addToMyCustomers(customerId: string | number): Observable<any> {
    const body = { customerId } as any;
    return this.post<any>('Customer/AddToMyCustomers', body);
  }
}
