import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BaseService {
  private readonly apiBase = 'https://localhost:7145/api';

  constructor(private readonly http: HttpClient) {}

  get<T = any>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return this.http.get<T>(`${this.apiBase}/${endpoint}`, { params: httpParams });
  }

  post<T = any>(endpoint: string, body?: any): Observable<T> {
    return this.http.post<T>(`${this.apiBase}/${endpoint}`, body);
  }

  put<T = any>(endpoint: string, body?: any): Observable<T> {
    return this.http.put<T>(`${this.apiBase}/${endpoint}`, body);
  }

  delete<T = any>(endpoint: string, body?: any): Observable<T> {
    return this.http.delete<T>(`${this.apiBase}/${endpoint}`, { body });
  }
}
