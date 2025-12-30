import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../core/base.service';
export interface ApiResponse<T> {
  isSuccess: boolean;
  data?: T;
  message?: string;
}

export interface ListItem {
  id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  unit?: string;
  discount?: number;
}

export interface CreateListItemRequest {
  ListId: string;
  ProductName: string;
  Price: number;
  Discount: number;
}

export interface PublishListItemRequest {
  ListId: string;
  IsPublish: boolean;
}

export interface ProductList {
  id: string;
  name: string;
  description: string;
  lastPublishDate: string;
  isPublish: boolean;
  storeId: string;
  store?: any;
  listItems?: any[];
  tenantId: string;
  createAt: string;
  createdBy: string;
  deleteAt?: string | null;
  deletedBy?: string | null;
  updateAt?: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ListsService extends BaseService { 
 
  getLists(storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/GetAll`, { storeId, tenantId });
  }

  getListById(id: string, storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/GetById`, { id, storeId, tenantId });
  }

  createList(listData: any, storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/Create`, { ...listData, storeId, tenantId });
  }

  updateList(listData: any, storeId: string, tenantId: string): Observable<any> {
    return this.post <any>(`ProductList/Update`, { ...listData, storeId, tenantId });
  }

  deleteList(id: string, storeId: string, tenantId: string): Observable<any> {
    return this.post  <any>(`ProductList/delete`, { 
      body: { id, storeId, tenantId } 
    });
  }

  // Get all list items
  getAllListItems(listId: string, storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/GetAllListItems`, { listId, storeId, tenantId });
  }

  // Create new list item
  createListItem(listItem: CreateListItemRequest, storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/CreateListItem`, { ...listItem, storeId, tenantId });
  }

  // Publish list
  publishList(listId: string, isPublish: boolean, storeId: string, tenantId: string): Observable<any> {
    return this.post<any>(`ProductList/PublisListItem`, { 
      ListId: listId, 
      IsPublish: isPublish, 
      storeId, 
      tenantId 
    });
  }
}
