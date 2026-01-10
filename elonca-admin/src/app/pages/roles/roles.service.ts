import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../../core/base.service';
import { Permission, PermissionCategory } from '../../models/role-new.model';

export interface RolePermissionsResponse {
  permissions: Permission[];
  categories: PermissionCategory[];
  rolePermissions: string[];
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  storeId?: number;
}

export interface GetAllRoleRequest {
  storeId?: number;
}

export interface GetAllRoleResponse {
  roles: Role[];
  totalCount: number;
  isSuccess: boolean;
  message?: string;
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  storeId?: number;
}

export interface CreateRoleResponse {
  isSuccess: boolean;
  message?: string;
  data?: Role;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // Get role by ID
  getRoleById(roleId: number): Observable<Role> {
    return this.get<Role>(`Role/GetById/${roleId}`).pipe(
      map((res: any) => res.data)
    );
  }

  // Get all permissions for a role
  getRolePermissions(roleId: number): Observable<RolePermissionsResponse> {
    return this.get<RolePermissionsResponse>(`Role/GetRolePermissions/${roleId}`);
  }

  // Update role permissions
  updateRolePermissions(roleId: number, permissionIds: string[]): Observable<any> {
    return this.post(`Role/UpdateRolePermissions/${roleId}`, { permissionIds });
  }

  // Get all available permissions
  getAllPermissions(): Observable<RolePermissionsResponse> {
    return this.get<RolePermissionsResponse>('Role/GetAllPermissions');
  }

  // Get all roles
  getAll(payload?: any): Observable<any> {
    const body = payload ?? {};
    console.log('RolesService.getAll - Sending request to Role/GetAll with payload:', body);
    return this.post<any>('Role/GetAll', body).pipe(
      map((res: any) => {
        console.log('RolesService.getAll - Response:', res);
        
        if (res && typeof res === 'object' && 'isSuccess' in res && res.isSuccess === false) {
          throw new Error(res?.message || 'İstek başarısız');
        }

        let roles: any[] = [];
        
        // Farklı response formatlarını kontrol et
        if (Array.isArray(res)) {
          roles = res;
        } else if (Array.isArray(res?.roles)) {
          roles = res.roles;
        } else if (Array.isArray(res?.data)) {
          roles = res.data;
        } else if (Array.isArray(res?.result)) {
          roles = res.result;
        } else if (Array.isArray(res?.value)) {
          roles = res.value;
        }

        return {
          roles: roles,
          totalCount: roles.length,
          isSuccess: true
        };
      })
    );
  }

  create(role: any): Observable<any> {
    console.log('RolesService.create - Creating role:', role);
    return this.post<any>('Role/Create', role).pipe(
      map((res: any) => {
        console.log('RolesService.create - Response:', res);
        return {
          isSuccess: res?.isSuccess ?? true,
          message: res?.message ?? 'Rol başarıyla oluşturuldu',
          data: res?.data ?? res
        };
      })
    );
  }
}
