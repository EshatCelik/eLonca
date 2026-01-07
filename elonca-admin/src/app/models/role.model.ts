export interface Role {
  id: string;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount?: number;
  permissions?: RolePermission[];
}

export interface PermissionGroup {
  id: string;
  name: string;
  icon: string;
  description: string;
  module: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  module: string;
  category: string;
  isActive: boolean;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  isGranted: boolean;
  grantedDate?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateRoleRequest {
  name: string;
  code?: string;
  storeId?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRolePermissionsRequest {
  roleId: string;
  permissions: {
    permissionId: string;
    isGranted: boolean;
    startDate?: string;
    endDate?: string;
  }[];
}

export interface RoleListResponse {
  roles: Role[];
  totalCount: number;
  page: number;
  pageSize: number;
}
