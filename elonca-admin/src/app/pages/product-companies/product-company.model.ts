export interface ProductCompany {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  isActive: boolean;
  isDeleted: boolean;
  createAt: string;
  createdBy: string;
  updateAt?: string;
  updatedBy?: string;
  deleteAt?: string;
  deletedBy?: string;
  tenantId: string;
  storeId: string;
}

export interface CreateProductCompanyCommand {
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  tenantId: string;
  storeId: string;
}

export interface UpdateProductCompanyCommand {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  taxOffice?: string;
  isActive: boolean;
  tenantId: string;
  storeId: string;
}

export interface GetAllProductCompanyQuery {
  tenantId: string;
  storeId: string;
}

export interface GetByIdProductCompanyQuery {
  id: string;
  tenantId: string;
  storeId: string;
}

export interface CreateProductCompanyCommandResponse {
  isSuccess: boolean;
  data?: ProductCompany;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface UpdateProductCompanyCommandResponse {
  isSuccess: boolean;
  data?: ProductCompany;
  message: string;
  errors: string[];
  statusCode: number;
}

export interface GetAllProductCompanyQueryResponse {
  isSuccess: boolean;
  data: ProductCompany[];
  message: string;
  errors: string[];
  statusCode: number;
}

export interface GetByIdProductCompanyQueryResponse {
  isSuccess: boolean;
  data?: ProductCompany;
  message: string;
  errors: string[];
  statusCode: number;
}
