import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ProductCompany, 
  CreateProductCompanyCommand, 
  UpdateProductCompanyCommand, 
  GetAllProductCompanyQuery, 
  GetByIdProductCompanyQuery,
  CreateProductCompanyCommandResponse,
  UpdateProductCompanyCommandResponse,
  GetAllProductCompanyQueryResponse,
  GetByIdProductCompanyQueryResponse
} from './product-company.model';

import { BaseService } from '../../core/base.service';
@Injectable({
  providedIn: 'root'
})
export class ProductCompaniesService extends BaseService {  

  // Tüm ürün firmalarını getir
  getAllProductCompanies(query: GetAllProductCompanyQuery): Observable<any> { 
    return this.post<any>(  `ProductCompany/GetAll`,query  );
  }

  // ID'ye göre ürün firması getir
  getProductCompanyById(query: GetByIdProductCompanyQuery): Observable<any> { 
    return this.post<any>(
      `ProductCompany/GetById`, query,  );
  }

  // Yeni ürün firması oluştur
  createProductCompany(command: any): Observable<any> {
    console.log('=== FINAL PAYLOAD ===', JSON.stringify(command, null, 2));
    
    // Try sending command directly first
    return this.post<any>(`ProductCompany/Create`, command);
  }

  // Ürün firması güncelle
  updateProductCompany(command: any): Observable<any  > {
   
    return this.post<any>(
      `ProductCompany/Update`,   command  );
  }

  // Ürün firması sil (soft delete)
  deleteProductCompany(commad :any): Observable<any> {
    
    return this.post<any>(`ProductCompany/Delete`, commad  );
  }
}
